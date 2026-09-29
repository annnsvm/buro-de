import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CourseMaterialType,
  PracticeBlock,
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

    const questions = await this.prisma.question.findMany({
      where: { materialId },
      select: { id: true, block: true, points: true },
    });

    /**
     * Every answer the student has given to these questions, whichever sitting it came from.
     * A block counts as done when nothing in it is left unanswered — leaving and coming back
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

    const blocks = PracticeService.ORDER.map((block) => {
      const inBlock = questions.filter((question) => question.block === block);
      if (inBlock.length === 0) return null;

      const answered = inBlock.filter((question) => latest.has(question.id));
      const correct = answered.filter((question) => latest.get(question.id));

      return {
        block,
        /**
         * How many questions are in it. The hub describes a block by what is actually inside —
         * "8 questions", not a fixed sentence — so it stays true as the author adds to it.
         */
        total: inBlock.length,
        answered: answered.length,
        correct: correct.length,
        /**
         * Answering everything completes the block; being right is not required. The score is
         * still reported, so the student sees how they did without being blocked by it.
         */
        done: answered.length === inBlock.length,
      };
    }).filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    return {
      material_id: material.id,
      /**
       * The teacher's own name for this practice. The hub shows it rather than a generic
       * heading, so the page and the lesson list do not call the same thing two things.
       */
      title: material.title,
      /** "Модуль N · Урок N.N" above the hub's title. */
      module_title: material.module?.title ?? null,
      lesson_title: material.parentMaterial?.title ?? null,
      blocks,
      done_count: blocks.filter((entry) => entry.done).length,
      total_count: blocks.length,
    };
  }
}
