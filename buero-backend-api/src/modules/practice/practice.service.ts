import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CourseMaterialType,
  PracticeBlock,
  PracticeElementKind,
  Role,
} from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseMaterialService } from '../course-materials/course-material.service';

/**
 * The hub of a lesson's practice: which blocks it has, and how far through each the student is.
 *
 * Nothing here needs a table of its own. A block is a property of a question and an answer is a
 * `question_attempts` row, so "how far through" is a count over what the student has already
 * done. That is also why the blocks arrived without touching anyone's progress.
 */
@Injectable()
export class PracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  /** The enum's order, so the blocks always read the same way round. */
  private static readonly ORDER = Object.values(PracticeBlock) as PracticeBlock[];

  /**
   * The two blocks that do not count towards finishing the practice.
   *
   * Speaking is marked by the student themselves and writing costs a paid check, so neither can
   * fairly decide whether a lesson is behind them. They are still shown, and still worth doing -
   * the interface says they are optional rather than hiding them.
   */
  private static readonly OPTIONAL: PracticeBlock[] = [
    PracticeBlock.sprechen,
    PracticeBlock.schreiben,
  ];

  async getOverview(materialId: string, userId: string, role: Role) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: materialId },
      include: { module: true, parentMaterial: { select: { title: true } } },
    });
    if (!material) {
      throw new NotFoundException(`Матеріал з id ${materialId} не знайдено`);
    }
    if (
      material.type !== CourseMaterialType.practice &&
      material.type !== CourseMaterialType.quiz
    ) {
      throw new BadRequestException('Матеріал не є практикою');
    }
    if (material.module?.courseId) {
      await this.courseMaterialService.assertCanAccessModule(
        userId,
        role,
        material.module.courseId,
        material.moduleId,
      );
    }

    const [questions, elements, letters, recordings] = await Promise.all([
      this.prisma.question.findMany({
        where: { materialId },
        /** `elementId` so a question about an unuploaded recording can be told apart. */
        select: { id: true, block: true, points: true, elementId: true },
      }),
      /**
       * A speaking or writing block is one task and no questions at all. Counting blocks by
       * their questions alone made those two vanish from the hub entirely - the student never
       * saw the work existed.
       */
      this.prisma.practiceElement.findMany({
        where: { materialId },
        /** `audioUrl` so a recording that exists only as a row is not counted as work. */
        select: { id: true, block: true, kind: true, audioUrl: true },
      }),
      /**
       * The letters this student has already written, by task.
       *
       * A writing block asks no questions, so none of the counting above can see it. Without
       * this a student could write the letter, be marked 6 out of 6, come back to the hub and
       * find the block looking exactly as untouched as before they started.
       */
      this.prisma.writingSubmission.findMany({
        where: { userId, courseMaterialId: materialId },
        select: { practiceElementId: true, score: true, maxScore: true },
      }),
      /**
       * And what they have recorded. Speaking asks no questions either, so the same blind spot
       * applied: a student could record every task in the lesson and the block would look
       * exactly as untouched as before they started.
       */
      this.prisma.speakingRecording.findMany({
        where: { userId, element: { materialId } },
        select: { practiceElementId: true },
      }),
    ]);

    /**
     * Every answer the student has given to these questions, whichever sitting it came from.
     * A block counts as done when nothing in it is left unanswered - leaving and coming back
     * must not undo the work, and a block answered across two sittings is still answered.
     */
    const answers = questions.length
      ? await this.prisma.questionAttempt.findMany({
          where: { userId, questionId: { in: questions.map((q) => q.id) } },
          select: { questionId: true, isCorrect: true, answeredAt: true },
          orderBy: { answeredAt: 'asc' },
        })
      : [];

    /** The latest answer to each question is the one that stands. */
    const latest = new Map<string, boolean>();
    for (const answer of answers) latest.set(answer.questionId, answer.isCorrect);

    const recorded = new Set(recordings.map((row) => row.practiceElementId));

    /** The best mark per task, which is the one that counts, as it does for a quiz. */
    const bestLetter = new Map<string, { score: number; max: number }>();
    for (const letter of letters) {
      if (!letter.practiceElementId) continue;
      const found = bestLetter.get(letter.practiceElementId);
      if (!found || letter.score > found.score) {
        bestLetter.set(letter.practiceElementId, {
          score: letter.score,
          max: letter.maxScore,
        });
      }
    }

    const blocks = PracticeService.ORDER.map((block) => {
      const everyQuestion = questions.filter((question) => question.block === block);
      const tasks = elements.filter((element) => element.block === block);
      if (everyQuestion.length === 0 && tasks.length === 0) return null;

      /**
       * Recordings the author has described but not uploaded yet.
       *
       * Their questions are held back by the player, so counting them here would ask the
       * student for answers they are never offered - and Hören counts towards finishing the
       * lesson, so the lesson itself could never be closed.
       */
      const awaitingAudio = tasks.filter(
        (task) => task.kind === PracticeElementKind.audio && !task.audioUrl,
      );
      const awaitingIds = new Set(awaitingAudio.map((task) => task.id));
      const inBlock = everyQuestion.filter(
        (question) =>
          !question.elementId || !awaitingIds.has(question.elementId),
      );

      const answered = inBlock.filter((question) => latest.has(question.id));
      const correct = answered.filter((question) => latest.get(question.id));

      /**
       * A block of letters is done when each letter has been written at least once.
       *
       * Being right is no more required here than it is of a question: the mark is reported
       * so the student can see it, and the block counts as behind them either way.
       */
      const written = tasks.filter(
        (task) => task.kind === PracticeElementKind.write,
      );
      const marks = written
        .map((task) => bestLetter.get(task.id))
        .filter((mark): mark is { score: number; max: number } => Boolean(mark));

      /**
       * Speaking is done when every prompt has a recording. There is no score to report and
       * none is invented: marking spoken German automatically is a judgement this platform
       * cannot make honestly, so the student makes it against the author's own answer.
       */
      const spoken = tasks.filter(
        (task) => task.kind === PracticeElementKind.rec,
      );
      const answered_tasks =
        marks.length + spoken.filter((task) => recorded.has(task.id)).length;
      const markable_tasks = written.length + spoken.length;

      /**
       * Whether there is anything to do in it at all yet.
       *
       * A listening block whose recordings have not been uploaded is not work the student can
       * do, so it is not counted - neither as done nor as outstanding. The screen says the
       * task is still being prepared.
       */
      const ready = inBlock.length > 0 || markable_tasks > 0;

      return {
        block,
        /** Shown and encouraged, but not counted - see OPTIONAL. */
        optional: PracticeService.OPTIONAL.includes(block),
        /** How many recordings this block is still waiting for. */
        awaiting_audio: awaitingAudio.length,
        ready,
        /** How many texts, recordings or tasks it holds, for a block that asks no questions. */
        task_count: tasks.length,
        /**
         * How many questions are in it. The hub describes a block by what is actually inside -
         * "8 questions", not a fixed sentence - so it stays true as the author adds to it.
         */
        total: inBlock.length,
        answered: answered.length,
        correct: correct.length,
        /**
         * The mark for a block that is scored out of criteria rather than questions, so the
         * hub can say 5 of 6 instead of the 0 of 0 that counting questions would give.
         */
        points:
          marks.length > 0
            ? {
                score: marks.reduce((sum, mark) => sum + mark.score, 0),
                max: marks.reduce((sum, mark) => sum + mark.max, 0),
              }
            : null,
        /**
         * Answering everything completes the block; being right is not required. The score is
         * still reported, so the student sees how they did without being blocked by it.
         *
         * A block that asks no questions - a speaking or a writing task - is never done by
         * this rule, because there is nothing to answer. Saying it was finished the moment it
         * appeared would have been a plain untruth.
         */
        done:
          !ready
            ? false
            : inBlock.length > 0
              ? answered.length === inBlock.length
              : answered_tasks === markable_tasks,
      };
    }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    return {
      material_id: material.id,
      /**
       * The teacher's own name for this practice. The hub shows it rather than a generic
       * heading, so the page and the lesson list do not call the same thing two things.
       */
      title: material.title,
      /**
       * Where the practice sits, shown above its title as two labels told apart by colour and
       * a wide gap rather than strung together with a separator.
       */
      module_title: material.module?.title ?? null,
      lesson_title: material.parentMaterial?.title ?? null,
      blocks,
      /**
       * Only the blocks that count. Speaking and writing are shown among the rest but kept out
       * of the figure, so "3 of 3" can be reached by doing the work that can actually be
       * marked, and the optional two never leave a lesson looking unfinished.
       */
      done_count: blocks.filter(
        (entry) => !entry.optional && entry.ready && entry.done,
      ).length,
      /**
       * Only the blocks that can be worked on. A block still waiting for its recordings is
       * left out of both halves, so "2 of 3" never means "and one you cannot finish".
       */
      total_count: blocks.filter((entry) => !entry.optional && entry.ready).length,
    };
  }
}
