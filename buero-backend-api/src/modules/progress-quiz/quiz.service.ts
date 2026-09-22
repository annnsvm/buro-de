import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role } from "src/generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { gradeAnswer } from "../exercises/exercise-registry";
import type { AnswerMatchQuality } from "../exercises/normalize-german";
import type { SubmitQuizDto } from "./dto/submit-quiz.dto";

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  async startAttempt(
    userId: string,
    role: Role,
    courseMaterialId: string,
  ) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: courseMaterialId },
      include: { module: true },
    });
    if (!material) {
      throw new NotFoundException(
        `Матеріал з id ${courseMaterialId} не знайдено`
      );
    }
    if (material.type !== "quiz") {
      throw new BadRequestException(
        "Матеріал не є квізом (type має бути quiz)"
      );
    }
    const courseId = material.module?.courseId;
    if (courseId) {
      await this.courseMaterialService.assertCanAccessCourse(
        userId,
        role,
        courseId,
      );
    }

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        courseMaterialId,
      },
    });

    return this.toAttemptResponse(attempt);
  }

  async getAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });
    if (!attempt) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.userId !== userId) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    return this.toAttemptResponse(attempt);
  }

  /**
   * Відправити всі відповіді квізу за раз: валідація по content, збереження snapshot,
   * підрахунок score, завершення спроби, оновлення course_progress.
   */
  async submitQuiz(
    attemptId: string,
    userId: string,
    body: SubmitQuizDto,
  ) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { courseMaterial: true },
    });
    if (!attempt) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.userId !== userId) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    if (attempt.completedAt) {
      throw new BadRequestException(
        "Спробу вже завершено, відповіді не приймаються",
      );
    }

    /**
     * Questions come from the table, not from the material's JSON. That is what makes
     * a per-question record possible, and it is also why the score is now out of the
     * number of questions in the quiz rather than the number of answers the browser
     * happened to send — previously one correct answer out of ten scored 100%.
     */
    const questions = await this.prisma.question.findMany({
      where: { materialId: attempt.courseMaterialId },
      orderBy: { orderIndex: "asc" },
    });
    if (questions.length === 0) {
      throw new BadRequestException(
        "Квіз не містить питань",
      );
    }
    const questionsById = new Map(questions.map((q) => [q.id, q]));

    const snapshot: Record<string, { question_id: string; answer: string | string[] }> = {};
    const results: Array<{
      question_id: string;
      correct: boolean;
      quality: AnswerMatchQuality;
    }> = [];
    const answeredIds = new Set<string>();
    let correctCount = 0;

    for (const a of body.answers) {
      const question = questionsById.get(a.question_id);
      if (!question) {
        throw new BadRequestException(
          `Питання з id "${a.question_id}" не знайдено в квізі`,
        );
      }
      if (answeredIds.has(a.question_id)) {
        throw new BadRequestException(
          `Питання з id "${a.question_id}" надіслано двічі`,
        );
      }
      answeredIds.add(a.question_id);

      snapshot[`question_${a.question_id}`] = {
        question_id: a.question_id,
        answer: a.answer,
      };

      const graded = gradeAnswer(question, a.answer);
      results.push({
        question_id: a.question_id,
        correct: graded.correct,
        quality: graded.quality,
      });
      if (graded.correct) correctCount += 1;
    }

    // An unanswered question is a wrong one, so it still appears in the breakdown.
    for (const question of questions) {
      if (answeredIds.has(question.id)) continue;
      results.push({
        question_id: question.id,
        correct: false,
        quality: "none",
      });
    }

    const total = questions.length;
    const score =
      total > 0 ? Math.round((correctCount / total) * 10000) / 100 : 0;
    const completedAt = new Date();

    const updated = await this.prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answersSnapshot: snapshot as object,
        score,
        completedAt,
      },
    });

    /**
     * One row per answered question. This is the record every later feature needs —
     * reviewing mistakes, repeating what was failed, a breakdown by topic — none of
     * which a single quiz score can answer.
     */
    await this.prisma.questionAttempt.createMany({
      data: body.answers.map((a) => ({
        userId,
        questionId: a.question_id,
        quizAttemptId: attemptId,
        isCorrect:
          results.find((r) => r.question_id === a.question_id)?.correct ?? false,
        rawAnswer: a.answer as object,
      })),
    });

    const materialWithModule = await this.prisma.courseMaterial.findUnique({
      where: { id: attempt.courseMaterialId },
      include: { module: true },
    });
    if (materialWithModule?.module?.courseId) {
      const courseId = materialWithModule.module.courseId;
      await this.prisma.courseProgress.upsert({
        where: {
          userId_courseId_courseMaterialId: {
            userId,
            courseId,
            courseMaterialId: attempt.courseMaterialId,
          },
        },
        create: {
          userId,
          courseId,
          courseMaterialId: attempt.courseMaterialId,
          completedAt,
          score,
        },
        update: { completedAt, score },
      });
    }

    return {
      attempt: this.toAttemptResponse(updated),
      score,
      total,
      correct: correctCount,
      results,
    };
  }

  private toAttemptResponse(attempt: {
    id: string;
    courseMaterialId: string;
    answersSnapshot: unknown;
    score: unknown;
    completedAt: Date | null;
    createdAt: Date;
  }) {
    return {
      id: attempt.id,
      course_material_id: attempt.courseMaterialId,
      status: attempt.completedAt
        ? ("completed" as const)
        : ("in_progress" as const),
      answers_snapshot: attempt.answersSnapshot as Record<
        string,
        unknown
      > | null,
      score: attempt.score != null ? Number(attempt.score) : null,
      completed_at: attempt.completedAt?.toISOString() ?? null,
      created_at: attempt.createdAt.toISOString(),
    };
  }

}
