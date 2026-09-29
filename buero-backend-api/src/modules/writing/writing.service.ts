import { createHash } from 'crypto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { CourseMaterialType, Role } from 'src/generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseMaterialService } from '../course-materials/course-material.service';
import { decideAttempt, ATTEMPTS_PER_TASK } from './attempt-policy';
import { gradeLetter } from './grade-letter';
import { preCheckLetter } from './letter-shape';
import { parseWritingTask, type WritingTask } from './writing-task';

/**
 * Submitting and grading a piece of writing.
 *
 * The order of the checks is the design. Everything free happens first — is the material a
 * writing task, may this student open it, has this exact text already been graded, is it long
 * enough, and do they have an attempt left — and only what survives all of that reaches a paid
 * call. A student can be turned away several times without a cent being spent or an attempt
 * being counted against them.
 */
@Injectable()
export class WritingService {
  private readonly logger = new Logger(WritingService.name);
  /** One client for the process; constructing one per request re-reads credentials each time. */
  private readonly anthropic = new Anthropic();
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
    const { task } = await this.loadTask(materialId, userId, role);
    const submissions = await this.prisma.writingSubmission.findMany({
      where: { userId, courseMaterialId: materialId },
      orderBy: { createdAt: 'desc' },
    });

    const decision = decideAttempt(
      await this.countAttempts(userId, materialId),
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
    const { task } = await this.loadTask(materialId, userId, role);
    const trimmed = text.trim();
    if (!trimmed) {
      throw new BadRequestException('Текст листа порожній');
    }

    /**
     * The same letter twice returns the stored result. It costs nothing and spends no attempt —
     * a double-click, a lost connection or a refresh must not be charged for.
     */
    const hash = hashText(trimmed);
    const already = await this.prisma.writingSubmission.findFirst({
      where: { userId, courseMaterialId: materialId, textHash: hash },
      orderBy: { createdAt: 'desc' },
    });
    if (already) {
      return {
        status: 'graded' as const,
        repeated: true,
        score: already.score,
        max_score: already.maxScore,
        assessment: already.assessment,
        attempts_left: await this.attemptsLeft(userId, materialId),
      };
    }

    /**
     * Length is settled before the limits are touched: a letter that is too short is a request
     * to write more, not a failed attempt, so it must not cost the student one.
     */
    const pre = preCheckLetter(trimmed, task.minSentences, task.maxSentences);
    if (!pre.ok) {
      return {
        status: 'needs_more' as const,
        reason: pre.reason,
        body_sentences: pre.shape.bodySentences,
        min_sentences: task.minSentences,
        max_sentences: task.maxSentences,
        attempts_left: await this.attemptsLeft(userId, materialId),
      };
    }

    const decision = decideAttempt(
      await this.countAttempts(userId, materialId),
      new Date(),
    );
    if (!decision.allowed) {
      return {
        status: 'blocked' as const,
        reason: decision.reason,
        retry_at: decision.retryAt?.toISOString() ?? null,
        /**
         * When the breaker tripped the task is not broken — the student reads the model answer
         * and marks themselves, exactly as the speaking task works.
         */
        self_check: decision.reason === 'budget',
        /** Only sent when there is nothing else to offer, so it is never a hint. */
        model_answer: decision.reason === 'budget' ? (task.modelAnswer ?? null) : null,
      };
    }

    if (!this.configured) {
      this.logger.error('ANTHROPIC_API_KEY is not set — writing checks cannot run');
      return {
        status: 'blocked' as const,
        reason: 'budget' as const,
        retry_at: null,
        /** Falls back to self-marking, the same way a spent budget does. */
        self_check: true,
        model_answer: task.modelAnswer ?? null,
      };
    }

    const result = await gradeLetter(task, trimmed, this.anthropic);
    if (result.status === 'rejected') {
      /** The shape check already passed, so this cannot normally happen. */
      return {
        status: 'needs_more' as const,
        reason: result.reason,
        body_sentences: pre.shape.bodySentences,
        min_sentences: task.minSentences,
        max_sentences: task.maxSentences,
        attempts_left: await this.attemptsLeft(userId, materialId),
      };
    }

    await this.prisma.writingSubmission.create({
      data: {
        userId,
        courseMaterialId: materialId,
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
      `Writing graded: material=${materialId} score=${result.score}/${task.criteria.length} ` +
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
  ): Promise<{ task: WritingTask }> {
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
    return { task: parseWritingTask(material.content) };
  }

  private async countAttempts(userId: string, materialId: string) {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [taskRows, todayAcrossTasks, monthAcrossEveryone] = await Promise.all([
      this.prisma.writingSubmission.findMany({
        where: { userId, courseMaterialId: materialId },
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

  private async attemptsLeft(userId: string, materialId: string): Promise<number> {
    const decision = decideAttempt(
      await this.countAttempts(userId, materialId),
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
