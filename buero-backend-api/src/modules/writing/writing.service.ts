import { createHash } from 'crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import {
  CourseMaterialType,
  PracticeElementKind,
  Role,
} from 'src/generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseMaterialService } from '../course-materials/course-material.service';
import { decideAttempt, ATTEMPTS_PER_TASK } from './attempt-policy';
import { gradeLetter } from './grade-letter';
import { preCheckLetter, requiresLetterShape } from './letter-shape';
import {
  InvalidWritingTaskError,
  parseWritingTask,
  type WritingTask,
} from './writing-task';

/**
 * Where a writing task came from.
 *
 * A letter is written either against a material of its own or against one task inside a
 * practice's Schreiben block, and everything after this point - the rubric, the attempt window,
 * the stored result - works the same way for both. Keeping the two apart only here is what let
 * the block arrive without touching a single existing submission.
 */
type TaskSource = {
  task: WritingTask;
  /** The material the attempt belongs to: the writing material, or the practice holding it. */
  materialId: string;
  /** Null for a writing material of its own; the task's id inside a practice block. */
  elementId: string | null;
  /** The author's heading, when a block holds more than one task. */
  title: string | null;
};

/**
 * Submitting and grading a piece of writing.
 *
 * The order of the checks is the design. Everything free happens first - is the material a
 * writing task, may this student open it, has this exact text already been graded, is it long
 * enough, and do they have an attempt left - and only what survives all of that reaches a paid
 * call. A student can be turned away several times without a cent being spent or an attempt
 * being counted against them.
 */
@Injectable()
export class WritingService {
  private readonly logger = new Logger(WritingService.name);
  /**
   * One client for the process, built the first time a letter actually reaches the grader.
   *
   * Still one - constructing it per request re-reads credentials every time - but no longer at
   * construction, because the SDK starts resolving credentials the moment it exists. Every
   * free check happens before this is touched, so a student turned away for a short letter
   * never causes a credential lookup at all.
   */
  private client: Anthropic | null = null;
  /**
   * Checked here rather than at boot: a missing key should disable one feature, not stop the
   * application. Saying so plainly also saves whoever sees it from reading an SDK auth error.
   */
  private readonly configured = Boolean(process.env.ANTHROPIC_API_KEY);

  constructor(
    private readonly prisma: PrismaService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  /**
   * What the student needs before they start writing: the task, the rubric they will be marked
   * against, how many goes they have left, and their best result so far.
   *
   * The criteria are shown up front on purpose. Being marked against a list you were never given
   * is the thing that makes automatic grading feel arbitrary.
   */
  async getTask(materialId: string, userId: string, role: Role) {
    return this.describe(await this.loadTask(materialId, userId, role), userId);
  }

  /**
   * Every writing task of a practice, in one answer.
   *
   * A block is one thing on screen, so it is one request: asking for the block's tasks and
   * then for each task's state in turn would show an empty block first and fill it in after.
   */
  async getPracticeTasks(materialId: string, userId: string, role: Role) {
    const { sources, unusable } = await this.loadPracticeElements(
      materialId,
      userId,
      role,
    );
    return {
      tasks: await Promise.all(
        sources.map(async (source) => ({
          element_id: source.elementId,
          title: source.title,
          ...(await this.describe(source, userId)),
        })),
      ),
      /**
       * Tasks that cannot be marked yet, named rather than hidden.
       *
       * One unfinished task must not take the block down with it, and it must not quietly
       * vanish either: the student is told this one is not ready, and the teacher can see
       * which it is and why.
       */
      unusable,
    };
  }

  /** The state of one task: the rubric, the goes left, and the best result so far. */
  private async describe(source: TaskSource, userId: string) {
    const { task } = source;
    const submissions = await this.prisma.writingSubmission.findMany({
      where: this.whereTask(userId, source),
      orderBy: { createdAt: 'desc' },
    });

    const decision = decideAttempt(
      await this.countAttempts(userId, source),
      new Date(),
    );
    const best = submissions.reduce<(typeof submissions)[number] | null>(
      (found, row) => (found === null || row.score > found.score ? row : found),
      null,
    );

    return {
      task: task.task,
      criteria: task.criteria,
      min_sentences: task.minSentences,
      max_sentences: task.maxSentences,
      max_score: task.criteria.length,
      attempts_used: submissions.length,
      attempts_per_window: ATTEMPTS_PER_TASK,
      can_submit: decision.allowed,
      attempts_left: decision.allowed ? decision.attemptsLeft + 1 : 0,
      blocked_reason: decision.allowed ? null : decision.reason,
      retry_at: decision.allowed ? null : (decision.retryAt?.toISOString() ?? null),
      /** The best attempt counts, as it does for quizzes. */
      best: best
        ? {
            score: best.score,
            assessment: best.assessment,
            text: best.text,
            submitted_at: best.createdAt.toISOString(),
          }
        : null,
    };
  }

  async submit(materialId: string, userId: string, role: Role, text: string) {
    return this.grade(await this.loadTask(materialId, userId, role), userId, text);
  }

  /** The same submission, against one task of a practice's Schreiben block. */
  async submitElement(
    elementId: string,
    userId: string,
    role: Role,
    text: string,
  ) {
    return this.grade(
      await this.loadElementTask(elementId, userId, role),
      userId,
      text,
    );
  }

  private async grade(source: TaskSource, userId: string, text: string) {
    const { task } = source;
    const trimmed = text.trim();
    if (!trimmed) {
      throw new BadRequestException('Текст листа порожній');
    }

    /**
     * The same letter twice returns the stored result. It costs nothing and spends no attempt -
     * a double-click, a lost connection or a refresh must not be charged for.
     */
    const hash = hashText(trimmed);
    const already = await this.prisma.writingSubmission.findFirst({
      where: { ...this.whereTask(userId, source), textHash: hash },
      orderBy: { createdAt: 'desc' },
    });
    if (already) {
      return {
        status: 'graded' as const,
        repeated: true,
        score: already.score,
        max_score: already.maxScore,
        assessment: already.assessment,
        attempts_left: await this.attemptsLeft(userId, source),
      };
    }

    /**
     * Length is settled before the limits are touched: a letter that is too short is a request
     * to write more, not a failed attempt, so it must not cost the student one.
     */
    /**
     * Whether a salutation and a closing are required is the rubric's to say, not ours. A task
     * asking for a story or a forum post used to be refused for not opening "Sehr geehrte
     * Frau …", which is a rule its author never wrote.
     */
    const pre = preCheckLetter(
      trimmed,
      task.minSentences,
      task.maxSentences,
      requiresLetterShape(task.criteria),
    );
    if (!pre.ok) {
      return {
        status: 'needs_more' as const,
        reason: pre.reason,
        body_sentences: pre.shape.bodySentences,
        min_sentences: task.minSentences,
        max_sentences: task.maxSentences,
        attempts_left: await this.attemptsLeft(userId, source),
      };
    }

    const decision = decideAttempt(
      await this.countAttempts(userId, source),
      new Date(),
    );
    if (!decision.allowed) {
      return {
        status: 'blocked' as const,
        reason: decision.reason,
        retry_at: decision.retryAt?.toISOString() ?? null,
        /**
         * When the breaker tripped the task is not broken - the student reads the model answer
         * and marks themselves, exactly as the speaking task works.
         */
        self_check: decision.reason === 'budget',
        /** Only sent when there is nothing else to offer, so it is never a hint. */
        model_answer: decision.reason === 'budget' ? (task.modelAnswer ?? null) : null,
      };
    }

    if (!this.configured) {
      this.logger.error('ANTHROPIC_API_KEY is not set - writing checks cannot run');
      return {
        status: 'blocked' as const,
        reason: 'budget' as const,
        retry_at: null,
        /** Falls back to self-marking, the same way a spent budget does. */
        self_check: true,
        model_answer: task.modelAnswer ?? null,
      };
    }

    this.client ??= new Anthropic();
    const result = await gradeLetter(task, trimmed, this.client);
    if (result.status === 'rejected') {
      /** The shape check already passed, so this cannot normally happen. */
      return {
        status: 'needs_more' as const,
        reason: result.reason,
        body_sentences: pre.shape.bodySentences,
        min_sentences: task.minSentences,
        max_sentences: task.maxSentences,
        attempts_left: await this.attemptsLeft(userId, source),
      };
    }

    await this.prisma.writingSubmission.create({
      data: {
        userId,
        courseMaterialId: source.materialId,
        practiceElementId: source.elementId,
        text: trimmed,
        textHash: hash,
        score: result.score,
        maxScore: task.criteria.length,
        assessment: result.assessment as unknown as Prisma.InputJsonObject,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
      },
    });

    this.logger.log(
      `Writing graded: material=${source.materialId}` +
        `${source.elementId ? ` task=${source.elementId}` : ''} ` +
        `score=${result.score}/${task.criteria.length} ` +
        `tokens=${result.usage.inputTokens}/${result.usage.outputTokens}`,
    );

    return {
      status: 'graded' as const,
      repeated: false,
      score: result.score,
      max_score: task.criteria.length,
      assessment: result.assessment,
      attempts_left: decision.attemptsLeft,
    };
  }

  /** The material, checked to be a writing task this student may open. */
  private async loadTask(
    materialId: string,
    userId: string,
    role: Role,
  ): Promise<TaskSource> {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: materialId },
      include: { module: true },
    });
    if (!material) {
      throw new NotFoundException(`Матеріал з id ${materialId} не знайдено`);
    }
    if (material.type !== CourseMaterialType.writing) {
      throw new BadRequestException('Матеріал не є письмовим завданням');
    }
    if (material.module?.courseId) {
      await this.courseMaterialService.assertCanAccessModule(
        userId,
        role,
        material.module.courseId,
        material.moduleId,
      );
    }
    return {
      task: parseWritingTask(material.content),
      materialId: material.id,
      elementId: null,
      title: null,
    };
  }

  /** One writing task inside a practice block, checked the same way. */
  private async loadElementTask(
    elementId: string,
    userId: string,
    role: Role,
  ): Promise<TaskSource> {
    const element = await this.prisma.practiceElement.findUnique({
      where: { id: elementId },
      include: { material: { include: { module: true } } },
    });
    if (!element) {
      throw new NotFoundException(`Завдання з id ${elementId} не знайдено`);
    }
    if (element.kind !== PracticeElementKind.write) {
      throw new BadRequestException('Завдання не є письмовим');
    }
    if (element.material.module?.courseId) {
      await this.courseMaterialService.assertCanAccessModule(
        userId,
        role,
        element.material.module.courseId,
        element.material.moduleId,
      );
    }
    try {
      return this.sourceFromElement(element);
    } catch (error: unknown) {
      if (error instanceof InvalidWritingTaskError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /** Every writing task of one practice, in the author's order. */
  private async loadPracticeElements(
    materialId: string,
    userId: string,
    role: Role,
  ): Promise<{
    sources: TaskSource[];
    unusable: Array<{ element_id: string; title: string; reason: string }>;
  }> {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: materialId },
      include: { module: true },
    });
    if (!material) {
      throw new NotFoundException(`Матеріал з id ${materialId} не знайдено`);
    }
    if (material.module?.courseId) {
      await this.courseMaterialService.assertCanAccessModule(
        userId,
        role,
        material.module.courseId,
        material.moduleId,
      );
    }
    const elements = await this.prisma.practiceElement.findMany({
      where: { materialId, kind: PracticeElementKind.write },
      orderBy: { orderIndex: 'asc' },
    });

    const sources: TaskSource[] = [];
    const unusable: Array<{ element_id: string; title: string; reason: string }> = [];
    for (const element of elements) {
      try {
        sources.push(this.sourceFromElement(element));
      } catch (error: unknown) {
        if (!(error instanceof InvalidWritingTaskError)) throw error;
        this.logger.warn(
          `Writing task ${element.id} of practice ${materialId} cannot be graded: ` +
            error.message,
        );
        unusable.push({
          element_id: element.id,
          title: element.title,
          reason: error.message,
        });
      }
    }
    return { sources, unusable };
  }

  /**
   * A practice task read as a writing task.
   *
   * The rubric is validated by the same schema a writing material's is, so an incomplete task
   * fails loudly at authoring time rather than reaching a student with nothing to be marked
   * against. The import already refuses a row without two criteria and a sentence range; this
   * is the second gate, for a task edited by hand afterwards.
   */
  private sourceFromElement(element: {
    id: string;
    materialId: string;
    title: string;
    body: string | null;
    criteria: string[];
    minSentences: number | null;
    maxSentences: number | null;
    sampleAnswer: string | null;
  }): TaskSource {
    return {
      task: parseWritingTask({
        /** The long form if the author wrote one, otherwise the heading is the whole task. */
        task: element.body?.trim() ? element.body : element.title,
        minSentences: element.minSentences,
        maxSentences: element.maxSentences,
        criteria: element.criteria,
        ...(element.sampleAnswer && { modelAnswer: element.sampleAnswer }),
      }),
      materialId: element.materialId,
      elementId: element.id,
      title: element.title,
    };
  }

  /**
   * Which submissions belong to this task.
   *
   * A practice may hold several letters, so a task is identified by its own id when it has
   * one. `practiceElementId: null` on the material route matters as much: without it a letter
   * written inside a practice would spend the attempts of the practice itself.
   */
  private whereTask(userId: string, source: TaskSource) {
    return source.elementId
      ? { userId, practiceElementId: source.elementId }
      : { userId, courseMaterialId: source.materialId, practiceElementId: null };
  }

  private async countAttempts(userId: string, source: TaskSource) {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [taskRows, todayAcrossTasks, monthAcrossEveryone] = await Promise.all([
      this.prisma.writingSubmission.findMany({
        where: this.whereTask(userId, source),
        select: { createdAt: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.writingSubmission.count({
        where: { userId, createdAt: { gte: dayAgo } },
      }),
      this.prisma.writingSubmission.count({ where: { createdAt: { gte: monthAgo } } }),
    ]);

    return {
      taskAttempts: taskRows.map((row) => row.createdAt),
      todayAcrossTasks,
      monthAcrossEveryone,
    };
  }

  private async attemptsLeft(userId: string, source: TaskSource): Promise<number> {
    const decision = decideAttempt(
      await this.countAttempts(userId, source),
      new Date(),
    );
    return decision.allowed ? decision.attemptsLeft + 1 : 0;
  }
}

/**
 * Whitespace and case are normalised before hashing, so a letter resubmitted with a stray line
 * break is recognised as the same one rather than paid for twice.
 */
const hashText = (text: string): string =>
  createHash('sha256')
    .update(text.toLowerCase().replace(/\s+/g, ' ').trim())
    .digest('hex');
