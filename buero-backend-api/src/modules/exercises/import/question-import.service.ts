import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import {
  CourseMaterialType,
  QuizMode,
} from '../../../generated/prisma/enums';
import { PrismaService } from '../../../prisma/prisma.service';
import { validateQuestion } from '../exercise-registry';
import {
  groupQuestions,
  parseQuestionCsv,
  type ParsedQuestion,
  type ParseProblem,
} from './parse-question-csv';

export type ImportTarget = {
  /** The quiz material this group of questions becomes. */
  title: string;
  /** Set when a material with this title already exists and will be replaced. */
  existingMaterialId: string | null;
  questionCount: number;
  typeCounts: Record<string, number>;
  points: number;
  /** Questions whose explanation mentions another acceptable wording. */
  alternatives: Array<{ id: string; prompt: string; wordings: string[] }>;
};

export type ImportPreview = {
  mode: QuizMode;
  targets: ImportTarget[];
  totalQuestions: number;
  /** Rows that could not be read; they are reported and left out. */
  problems: ParseProblem[];
  /** Questions the exercise definitions consider unanswerable. */
  unusable: Array<{ id: string; reasons: string[] }>;
};

const TEST_MATERIAL_TITLE = 'Тест модуля';

/**
 * Loads a module's questions from the CSV the author writes them in.
 *
 * Adding sixty-four questions through a form, one at a time, is not a slow way of
 * filling the platform — it is the reason the platform stays empty. The file the
 * author already keeps is therefore the input, and importing it twice updates what is
 * there instead of creating a second copy, so a typo can be fixed in the file and
 * re-imported.
 */
@Injectable()
export class QuestionImportService {
  constructor(private readonly prisma: PrismaService) {}

  async preview(
    courseId: string,
    moduleId: string,
    csv: string,
    mode: QuizMode,
  ): Promise<ImportPreview> {
    const { plan, problems, unusable } = await this.buildPlan(
      courseId,
      moduleId,
      csv,
      mode,
    );

    return {
      mode,
      problems,
      unusable,
      totalQuestions: plan.reduce(
        (sum, target) => sum + target.questions.length,
        0,
      ),
      targets: plan.map((target) => ({
        title: target.title,
        existingMaterialId: target.existingMaterialId,
        questionCount: target.questions.length,
        points: target.questions.reduce(
          (sum, question) => sum + question.points,
          0,
        ),
        typeCounts: target.questions.reduce<Record<string, number>>(
          (counts, question) => {
            counts[question.type] = (counts[question.type] ?? 0) + 1;
            return counts;
          },
          {},
        ),
        alternatives: target.questions
          .filter((question) => question.suggestedAlternatives.length > 0)
          .map((question) => ({
            id: question.id,
            prompt: question.prompt,
            wordings: question.suggestedAlternatives,
          })),
      })),
    };
  }

  /**
   * Writes the plan out. One transaction, so a file that fails halfway leaves the
   * module as it was rather than half-imported.
   */
  async commit(
    courseId: string,
    moduleId: string,
    csv: string,
    mode: QuizMode,
    options: { passingScore?: number; acceptAlternatives?: boolean } = {},
  ): Promise<ImportPreview & { created: number; updated: number }> {
    const { plan, problems, unusable } = await this.buildPlan(
      courseId,
      moduleId,
      csv,
      mode,
    );

    let created = 0;
    let updated = 0;
    const lastIndex = await this.prisma.courseMaterial.aggregate({
      where: { moduleId },
      _max: { orderIndex: true },
    });
    let nextIndex = (lastIndex._max.orderIndex ?? -1) + 1;

    await this.prisma.$transaction(async (tx) => {
      for (const target of plan) {
        let materialId = target.existingMaterialId;

        if (materialId) {
          await tx.courseMaterial.update({
            where: { id: materialId },
            data: {
              quizMode: mode,
              ...(options.passingScore !== undefined && {
                passingScore: options.passingScore,
              }),
            },
          });
          updated += 1;
        } else {
          const material = await tx.courseMaterial.create({
            data: {
              moduleId,
              type: CourseMaterialType.quiz,
              title: target.title,
              // The questions live in their own table; the JSON stays empty.
              content: {},
              quizMode: mode,
              ...(options.passingScore !== undefined && {
                passingScore: options.passingScore,
              }),
              orderIndex: nextIndex,
            },
          });
          nextIndex += 1;
          materialId = material.id;
          created += 1;
        }

        const keptIds = target.questions.map((question) => question.id);
        await tx.question.deleteMany({
          where: { materialId, id: { notIn: keptIds } },
        });

        for (const [index, question] of target.questions.entries()) {
          const acceptedAnswers = options.acceptAlternatives
            ? [...question.acceptedAnswers, ...question.suggestedAlternatives]
            : question.acceptedAnswers;

          const data = {
            materialId,
            type: question.type,
            prompt: question.prompt,
            payload: {
              ...(question.options.length > 0 && { options: question.options }),
              ...((question as { tokens?: string[] }).tokens && {
                tokens: (question as { tokens?: string[] }).tokens,
              }),
            } as Prisma.InputJsonObject,
            acceptedAnswers,
            explanation: question.explanation,
            points: question.points,
            orderIndex: index,
          };

          await tx.question.upsert({
            where: { id: question.id },
            create: { id: question.id, ...data },
            update: data,
          });
        }
      }
    });

    const preview = await this.preview(courseId, moduleId, csv, mode);
    return { ...preview, problems, unusable, created, updated };
  }

  private async buildPlan(
    courseId: string,
    moduleId: string,
    csv: string,
    mode: QuizMode,
  ) {
    const module = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, courseId },
    });
    if (!module) {
      throw new NotFoundException(
        `Модуль з id ${moduleId} не знайдено або не належить курсу`,
      );
    }

    const { questions, problems } = parseQuestionCsv(csv);

    /** A question the graders cannot mark would be a dead end for the student. */
    const unusable = questions
      .map((question) => ({
        id: question.id,
        reasons: validateQuestion({
          id: question.id,
          type: question.type,
          payload: {
            ...(question.options.length > 0 && { options: question.options }),
            ...((question as { tokens?: string[] }).tokens && {
              tokens: (question as { tokens?: string[] }).tokens,
            }),
          },
          acceptedAnswers: question.acceptedAnswers,
        }),
      }))
      .filter((entry) => entry.reasons.length > 0);

    const unusableIds = new Set(unusable.map((entry) => entry.id));
    const usable = questions.filter(
      (question) => !unusableIds.has(question.id),
    );

    const groups =
      mode === QuizMode.test
        ? [{ group: TEST_MATERIAL_TITLE, questions: usable }]
        : groupQuestions(usable);

    const existing = await this.prisma.courseMaterial.findMany({
      where: { moduleId, type: CourseMaterialType.quiz },
      select: { id: true, title: true },
    });
    const idByTitle = new Map(
      existing.map((material) => [material.title, material.id]),
    );

    const plan = groups
      .filter((entry) => entry.questions.length > 0)
      .map((entry) => ({
        title: entry.group,
        existingMaterialId: idByTitle.get(entry.group) ?? null,
        questions: entry.questions as ParsedQuestion[],
      }));

    return { plan, problems, unusable };
  }
}
