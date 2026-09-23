import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '../../generated/prisma/client';
import {
  CourseMaterialType,
  QuestionType,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { validateQuestion } from './exercise-registry';
import type {
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

    const data = {
      materialId,
      type: dto.type,
      prompt: dto.prompt.trim(),
      payload: payload as Prisma.InputJsonObject,
      acceptedAnswers,
      explanation: dto.explanation?.trim() || null,
      points: dto.points ?? 1,
      skills: dto.skills ?? [],
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
    if (material.type !== CourseMaterialType.quiz) {
      throw new BadRequestException('Матеріал не є квізом');
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
      options: payload.options ?? [],
      tokens: payload.tokens ?? [],
    };
  }
}
