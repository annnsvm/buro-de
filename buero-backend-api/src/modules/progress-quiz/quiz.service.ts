import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Role } from "src/generated/prisma/enums";
import { PrismaService } from "../../prisma/prisma.service";
import { shuffle } from "./shuffle";
import { CourseMaterialService } from "../course-materials/course-material.service";
import {
  describeAcceptedAnswers,
  gradeAnswer,
} from "../exercises/exercise-registry";
import type { AnswerMatchQuality } from "../exercises/normalize-german";
import type { AnswerQuestionDto } from "./dto/answer-question.dto";
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

  /**
   * The questions of a quiz, in the shape a student may see them.
   *
   * Never includes acceptedAnswers or the explanation: the answer key stays on the
   * server, and the explanation is revealed by the submit response once the student
   * has actually answered.
   */
  async getQuestions(materialId: string, userId: string, role: Role) {
    await this.assertCanAccessQuiz(materialId, userId, role);

    const questions = await this.prisma.question.findMany({
      where: { materialId },
      orderBy: { orderIndex: "asc" },
    });

    return questions.map((question) => {
      const payload = (question.payload ?? {}) as {
        options?: Array<{ id: string; text: string }>;
        tokens?: string[];
      };
      return {
        id: question.id,
        type: question.type,
        prompt: question.prompt,
        points: question.points,
        order_index: question.orderIndex,
        ...(Array.isArray(payload.options) && {
          options: payload.options.map((option) => ({
            id: option.id,
            text: option.text,
          })),
        }),
        /**
         * Shuffled, because the authored order of the words is usually the answer.
         */
        ...(Array.isArray(payload.tokens) && {
          tokens: shuffle(payload.tokens),
        }),
      };
    });
  }

  /**
   * The student's last finished attempt at this quiz, or null if there is none.
   *
   * Without this, leaving a lesson and coming back showed an empty quiz: the work was
   * recorded but never shown again, so the answers and explanations were effectively
   * lost the moment the student navigated away.
   */
  async getLastAttempt(materialId: string, userId: string, role: Role) {
    await this.assertCanAccessQuiz(materialId, userId, role);

    const attempt = await this.prisma.quizAttempt.findFirst({
      where: { userId, courseMaterialId: materialId, completedAt: { not: null } },
      orderBy: { completedAt: "desc" },
    });
    if (!attempt) return null;

    const [answers, questions] = await Promise.all([
      this.prisma.questionAttempt.findMany({
        where: { quizAttemptId: attempt.id },
      }),
      this.prisma.question.findMany({ where: { materialId } }),
    ]);
    const questionsById = new Map(questions.map((q) => [q.id, q]));

    return {
      attempt_id: attempt.id,
      completed_at: attempt.completedAt?.toISOString() ?? null,
      score: attempt.score != null ? Number(attempt.score) : 0,
      total: questions.length,
      correct: answers.filter((answer) => answer.isCorrect).length,
      answers: answers.flatMap((answer) => {
        const question = questionsById.get(answer.questionId);
        if (!question) return [];
        /**
         * Re-graded rather than stored: the quality of a near miss is derived from the
         * answer, so keeping it in two places would let the two disagree.
         */
        const graded = gradeAnswer(
          question,
          answer.rawAnswer as string | string[],
        );
        return [
          {
            question_id: answer.questionId,
            correct: answer.isCorrect,
            quality: graded.quality,
            explanation: question.explanation,
            accepted_answers: describeAcceptedAnswers(question),
            raw_answer: answer.rawAnswer as string | string[],
          },
        ];
      }),
    };
  }

  /** Shared access check for the quiz endpoints that work from a material id. */
  private async assertCanAccessQuiz(
    materialId: string,
    userId: string,
    role: Role,
  ) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: materialId },
      include: { module: true },
    });
    if (!material) {
      throw new NotFoundException(`Матеріал з id ${materialId} не знайдено`);
    }
    if (material.type !== "quiz") {
      throw new BadRequestException("Матеріал не є квізом (type має бути quiz)");
    }
    if (material.module?.courseId) {
      await this.courseMaterialService.assertCanAccessModule(
        userId,
        role,
        material.module.courseId,
        material.moduleId,
      );
    }
    return material;
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
  /**
   * Grades one answer as soon as it is given.
   *
   * Immediate feedback is what makes a practice quiz teach rather than test: the
   * student sees at once whether they were right and reads the explanation while the
   * question is still in mind. A question can only be answered once per attempt —
   * otherwise the feedback would just hand over the answer to enter next.
   *
   * The attempt finishes itself once every question has been answered, so no separate
   * submit is needed in this mode. Quizzes meant as assessment keep using submitQuiz,
   * which reveals nothing until everything has been sent.
   */
  async answerQuestion(
    attemptId: string,
    userId: string,
    body: AnswerQuestionDto,
  ) {
    const attempt = await this.loadOwnAttempt(attemptId, userId);
    if (attempt.completedAt) {
      throw new BadRequestException(
        "Спробу вже завершено, відповіді не приймаються",
      );
    }

    const question = await this.prisma.question.findFirst({
      where: { id: body.question_id, materialId: attempt.courseMaterialId },
    });
    if (!question) {
      throw new NotFoundException(
        `Питання з id "${body.question_id}" не знайдено в цьому квізі`,
      );
    }

    const already = await this.prisma.questionAttempt.findFirst({
      where: { quizAttemptId: attemptId, questionId: question.id },
    });
    if (already) {
      throw new BadRequestException("На це питання вже відповіли");
    }

    const graded = gradeAnswer(question, body.answer);
    await this.prisma.questionAttempt.create({
      data: {
        userId,
        questionId: question.id,
        quizAttemptId: attemptId,
        isCorrect: graded.correct,
        rawAnswer: body.answer as object,
      },
    });

    const [questionCount, answers] = await Promise.all([
      this.prisma.question.count({
        where: { materialId: attempt.courseMaterialId },
      }),
      this.prisma.questionAttempt.findMany({
        where: { quizAttemptId: attemptId },
        select: { isCorrect: true },
      }),
    ]);

    const finished = answers.length >= questionCount;
    const summary = finished
      ? await this.finishAttempt(attempt, userId, answers, questionCount)
      : null;

    return {
      question_id: question.id,
      correct: graded.correct,
      quality: graded.quality,
      explanation: question.explanation,
      /**
       * Revealed only for the question just answered. Without it a wrong answer tells
       * the student nothing about what the right one was.
       */
      accepted_answers: describeAcceptedAnswers(question),
      answered: answers.length,
      total: questionCount,
      summary,
    };
  }

  /** Scores the attempt, marks it complete and records progress on the material. */
  private async finishAttempt(
    attempt: { id: string; courseMaterialId: string },
    userId: string,
    answers: Array<{ isCorrect: boolean }>,
    questionCount: number,
  ) {
    const correctCount = answers.filter((answer) => answer.isCorrect).length;
    const score =
      questionCount > 0
        ? Math.round((correctCount / questionCount) * 10000) / 100
        : 0;
    const completedAt = new Date();

    await this.prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { score, completedAt },
    });
    await this.recordMaterialProgress(
      attempt.courseMaterialId,
      userId,
      score,
      completedAt,
    );

    return { score, total: questionCount, correct: correctCount };
  }

  private async loadOwnAttempt(attemptId: string, userId: string) {
    const attempt = await this.prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });
    // Someone else's attempt reads as missing rather than as forbidden.
    if (!attempt || attempt.userId !== userId) {
      throw new NotFoundException(`Спробу з id ${attemptId} не знайдено`);
    }
    return attempt;
  }

  private async recordMaterialProgress(
    courseMaterialId: string,
    userId: string,
    score: number,
    completedAt: Date,
  ) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: courseMaterialId },
      include: { module: true },
    });
    const courseId = material?.module?.courseId;
    if (!courseId) return;

    await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId_courseMaterialId: {
          userId,
          courseId,
          courseMaterialId,
        },
      },
      create: { userId, courseId, courseMaterialId, completedAt, score },
      update: { completedAt, score },
    });
  }

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
      explanation: string | null;
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
        // Authored alongside the question; shown only now that it has been answered.
        explanation: question.explanation,
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
        explanation: question.explanation,
      });
    }

    const orderById = new Map(questions.map((q, index) => [q.id, index]));
    results.sort(
      (a, b) =>
        (orderById.get(a.question_id) ?? 0) - (orderById.get(b.question_id) ?? 0),
    );

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
