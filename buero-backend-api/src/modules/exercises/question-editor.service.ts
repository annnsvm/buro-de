import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '../../generated/prisma/client';
import {
  CourseMaterialType,
  PracticeBlock,
  QuestionType,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { validateQuestion } from './exercise-registry';
import type {
  SavePracticeElementDto,
  SaveQuestionDto,
  ReorderQuestionsDto,
} from './question-editor.dto';

/**
 * Editing a quiz's questions on the platform.
 *
 * Questions used to be edited as JSON inside the material and mirrored into the table
 * on every save. That made the material the source of truth and the table a copy,
 * which went wrong the moment a quiz was filled by import: the material's JSON was
 * empty, so renaming the quiz rebuilt its questions from nothing and deleted them.
 * The table is now the only place questions live, and this is how they are changed.
 */
@Injectable()
export class QuestionEditorService {
  constructor(private readonly prisma: PrismaService) {}

  async list(courseId: string, moduleId: string, materialId: string) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const questions = await this.prisma.question.findMany({
      where: { materialId },
      orderBy: { orderIndex: 'asc' },
    });
    return questions.map((question) => this.toResponse(question));
  }

  async save(
    courseId: string,
    moduleId: string,
    materialId: string,
    questionId: string | null,
    dto: SaveQuestionDto,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);

    const payload = this.buildPayload(dto);
    const acceptedAnswers = dto.accepted_answers
      .map((answer) => answer.trim())
      .filter(Boolean);

    /**
     * Refuse a question a student could not answer — no options to choose from, an
     * answer key pointing at an option that no longer exists, nothing marked correct.
     * Letting it through means a dead end discovered mid-lesson.
     */
    const problems = validateQuestion({
      id: questionId ?? 'new',
      type: dto.type,
      payload,
      acceptedAnswers,
    });
    if (problems.length > 0) {
      throw new BadRequestException(problems.join('; '));
    }

    /**
     * A question may only point at a text of this same material and block — otherwise a
     * student would be asked about a text the block never shows them.
     */
    const block = dto.block ?? PracticeBlock.grammatik;
    const elementId = await this.resolveElementId(materialId, block, dto.element_id);

    const data = {
      materialId,
      type: dto.type,
      prompt: dto.prompt.trim(),
      payload: payload as Prisma.InputJsonObject,
      acceptedAnswers,
      explanation: dto.explanation?.trim() || null,
      points: dto.points ?? 1,
      skills: dto.skills ?? [],
      block,
      elementId,
    };

    if (questionId) {
      const existing = await this.prisma.question.findFirst({
        where: { id: questionId, materialId },
      });
      if (!existing) {
        throw new NotFoundException('Питання не знайдено в цьому квізі');
      }
      const updated = await this.prisma.question.update({
        where: { id: questionId },
        data,
      });
      return this.toResponse(updated);
    }

    const last = await this.prisma.question.aggregate({
      where: { materialId },
      _max: { orderIndex: true },
    });
    const created = await this.prisma.question.create({
      data: {
        id: randomUUID(),
        ...data,
        orderIndex: (last._max.orderIndex ?? -1) + 1,
      },
    });
    return this.toResponse(created);
  }

  async remove(
    courseId: string,
    moduleId: string,
    materialId: string,
    questionId: string,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const existing = await this.prisma.question.findFirst({
      where: { id: questionId, materialId },
    });
    if (!existing) {
      throw new NotFoundException('Питання не знайдено в цьому квізі');
    }
    await this.prisma.question.delete({ where: { id: questionId } });
    return { deleted: true, id: questionId };
  }

  async reorder(
    courseId: string,
    moduleId: string,
    materialId: string,
    dto: ReorderQuestionsDto,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);

    const owned = await this.prisma.question.findMany({
      where: { materialId },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map((question) => question.id));
    const foreign = dto.ids.filter((id) => !ownedIds.has(id));
    if (foreign.length > 0) {
      throw new BadRequestException(
        `Питання не належать цьому квізу: ${foreign.join(', ')}`,
      );
    }

    await this.prisma.$transaction(
      dto.ids.map((id, index) =>
        this.prisma.question.update({
          where: { id },
          data: { orderIndex: index },
        }),
      ),
    );
    return this.list(courseId, moduleId, materialId);
  }

  /** The texts and recordings of a material, or of one of its blocks. */
  async listElements(
    courseId: string,
    moduleId: string,
    materialId: string,
    block?: PracticeBlock,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const elements = await this.prisma.practiceElement.findMany({
      where: { materialId, ...(block ? { block } : {}) },
      orderBy: [{ block: 'asc' }, { orderIndex: 'asc' }],
      /**
       * How many questions point at each text. A text nobody's question points at is never
       * shown to a student, and that is invisible from the outside — the count is how the
       * author finds out while they are still on the page.
       */
      include: { _count: { select: { questions: true } } },
    });
    return elements.map((element) => this.toElementResponse(element));
  }

  async saveElement(
    courseId: string,
    moduleId: string,
    materialId: string,
    elementId: string | null,
    dto: SavePracticeElementDto,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);

    const data = {
      block: dto.block,
      kind: dto.kind,
      title: dto.title.trim(),
      body: dto.body?.trim() || null,
      transcript: dto.transcript?.trim() || null,
      sampleAnswer: dto.sample_answer?.trim() || null,
      hints: dto.hints?.trim() || null,
    };

    if (elementId) {
      const existing = await this.prisma.practiceElement.findFirst({
        where: { id: elementId, materialId },
      });
      if (!existing) {
        throw new NotFoundException('Матеріал для читання не знайдено');
      }
      const updated = await this.prisma.practiceElement.update({
        where: { id: elementId },
        data,
      });
      return this.toElementResponse(updated);
    }

    const last = await this.prisma.practiceElement.aggregate({
      where: { materialId, block: dto.block },
      _max: { orderIndex: true },
    });
    const created = await this.prisma.practiceElement.create({
      data: {
        id: randomUUID(),
        materialId,
        ...data,
        orderIndex: (last._max.orderIndex ?? -1) + 1,
      },
    });
    return this.toElementResponse(created);
  }

  /**
   * Deleting a text leaves its questions in place, unbound.
   *
   * The alternative — taking the questions down with it — turns a mistyped title into lost
   * work. The database's own rule already does this (`onDelete: SetNull`); this only says so
   * out loud, and reports how many questions were freed so it is not a silent change.
   */
  async removeElement(
    courseId: string,
    moduleId: string,
    materialId: string,
    elementId: string,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const existing = await this.prisma.practiceElement.findFirst({
      where: { id: elementId, materialId },
    });
    if (!existing) {
      throw new NotFoundException('Матеріал для читання не знайдено');
    }
    const orphaned = await this.prisma.question.count({ where: { elementId } });
    await this.prisma.practiceElement.delete({ where: { id: elementId } });
    return { deleted: true, id: elementId, unbound_questions: orphaned };
  }

  /**
   * Accepts a text only if it belongs to this material and this block.
   *
   * Silently dropping a wrong id would leave the teacher believing the question was bound;
   * refusing says which of the two went wrong while it can still be corrected.
   */
  private async resolveElementId(
    materialId: string,
    block: PracticeBlock,
    elementId?: string,
  ): Promise<string | null> {
    if (!elementId) return null;
    const element = await this.prisma.practiceElement.findFirst({
      where: { id: elementId, materialId, block },
      select: { id: true },
    });
    if (!element) {
      throw new BadRequestException(
        'Текст не знайдено в цьому блоці практики',
      );
    }
    return element.id;
  }

  private toElementResponse(element: {
    id: string;
    block: PracticeBlock;
    kind: string;
    title: string;
    body: string | null;
    audioUrl: string | null;
    transcript: string | null;
    sampleAnswer: string | null;
    hints: string | null;
    orderIndex: number;
    _count?: { questions: number };
  }) {
    return {
      id: element.id,
      block: element.block,
      kind: element.kind,
      title: element.title,
      body: element.body,
      audio_url: element.audioUrl,
      transcript: element.transcript,
      sample_answer: element.sampleAnswer,
      hints: element.hints,
      order_index: element.orderIndex,
      question_count: element._count?.questions ?? 0,
    };
  }

  /** Shapes only what the chosen type needs, so stale fields cannot linger. */
  private buildPayload(dto: SaveQuestionDto): Record<string, unknown> {
    if (
      dto.type === QuestionType.single_choice ||
      dto.type === QuestionType.multi_choice
    ) {
      return {
        options: (dto.options ?? []).map((option) => ({
          id: option.id?.trim() || randomUUID(),
          text: option.text,
        })),
      };
    }
    if (dto.type === QuestionType.ordering) {
      return { tokens: (dto.tokens ?? []).map((token) => token.trim()).filter(Boolean) };
    }
    return {};
  }

  private async assertQuizMaterial(
    courseId: string,
    moduleId: string,
    materialId: string,
  ) {
    const material = await this.prisma.courseMaterial.findFirst({
      where: { id: materialId, moduleId, module: { courseId } },
    });
    if (!material) {
      throw new NotFoundException(
        'Матеріал не знайдено або не належить цьому модулю',
      );
    }
    /** A practice holds questions in the same way a quiz does, so both are editable here. */
    if (
      material.type !== CourseMaterialType.quiz &&
      material.type !== CourseMaterialType.practice
    ) {
      throw new BadRequestException('Матеріал не містить питань');
    }
    return material;
  }

  private toResponse(question: {
    id: string;
    type: QuestionType;
    prompt: string;
    payload: unknown;
    acceptedAnswers: string[];
    explanation: string | null;
    points: number;
    skills: string[];
    orderIndex: number;
    block: PracticeBlock;
    elementId: string | null;
  }) {
    const payload = (question.payload ?? {}) as {
      options?: Array<{ id: string; text: string }>;
      tokens?: string[];
    };
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      /** The teacher edits the answer key, so unlike the player they do see it. */
      accepted_answers: question.acceptedAnswers,
      explanation: question.explanation,
      points: question.points,
      skills: question.skills,
      order_index: question.orderIndex,
      block: question.block,
      element_id: question.elementId,
      options: payload.options ?? [],
      tokens: payload.tokens ?? [],
    };
  }
}
