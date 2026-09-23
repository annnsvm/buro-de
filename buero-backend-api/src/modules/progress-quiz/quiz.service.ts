import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { QuizMode, Role } from "src/generated/prisma/enums";
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
    const material = await this.assertCanAccessQuiz(materialId, userId, role);

    const questions = await this.prisma.question.findMany({
      where: { materialId },
      orderBy: { orderIndex: "asc" },
    });

    /**
     * The mode travels with the questions because the player has to know, before the
     * first answer, whether to mark answers one at a time or hold everything back
     * until the whole test is submitted.
     */
    return {
      mode: material.quizMode ?? QuizMode.practice,
      passing_score: material.passingScore,
      questions: questions.map((question) => {
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
      }),
    };
  }

  /**
   * The student's last finished attempt at this quiz, or null if there is none.
   *
   * Without this, leaving a lesson and coming back showed an empty quiz: the work was
   * recorded but never shown again, so the answers and explanations were effectively
   * lost the moment the student navigated away.
   */
  async getLastAttempt(materialId: string, userId: string, role: Role) {
    const material = await this.assertCanAccessQuiz(materialId, userId, role);

    /**
     * The best attempt, not the most recent one: however many times a student tries,
     * what they see when they come back is the best they have managed. A later, worse
     * attempt must not replace it.
     */
    const { best: attempt, hasOutdated } = await this.bestCurrentAttempt(
      materialId,
      userId,
    );
    if (!attempt) {
      /**
       * Nothing to replay, but say whether that is because the quiz changed — the
       * student should know their earlier result no longer applies rather than find
       * an empty quiz where a score used to be.
       */
      return hasOutdated ? { outdated: true } : null;
    }

    const [answers, questions] = await Promise.all([
      this.prisma.questionAttempt.findMany({
        where: { quizAttemptId: attempt.id },
      }),
      this.prisma.question.findMany({ where: { materialId } }),
    ]);
    const questionsById = new Map(questions.map((q) => [q.id, q]));

    const score = attempt.score != null ? Number(attempt.score) : 0;
    const reveal = this.mayRevealAnswers(material, score);

    const attemptCount = await this.prisma.quizAttempt.count({
      where: { userId, courseMaterialId: materialId, completedAt: { not: null } },
    });

    return {
      attempt_id: attempt.id,
      completed_at: attempt.completedAt?.toISOString() ?? null,
      score,
      total: questions.length,
      correct: answers.filter((answer) => answer.isCorrect).length,
      attempts: attemptCount,
      mode: material.quizMode ?? QuizMode.practice,
      passing_score: material.passingScore,
      passed: material.passingScore == null ? null : score >= material.passingScore,
      reveal_answers: reveal,
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
            explanation: reveal ? question.explanation : null,
            accepted_answers: reveal ? describeAcceptedAnswers(question) : [],
            raw_answer: answer.rawAnswer as string | string[],
          },
        ];
      }),
    };
  }

  /**
   * The student's best attempt at the quiz **as it stands today**.
   *
   * A score only means something against the set of questions it was earned on. When
   * the author adds or removes a question, an older attempt answered a different quiz:
   * showing 100% from before a ninth question was added would overstate what the
   * student has actually done. Such attempts are passed over, and the next attempt
   * sets the result again.
   */
  private async bestCurrentAttempt(materialId: string, userId: string) {
    const questions = await this.prisma.question.findMany({
      where: { materialId },
      select: { id: true },
    });
    const currentIds = new Set(questions.map((question) => question.id));

    const attempts = await this.prisma.quizAttempt.findMany({
      where: { userId, courseMaterialId: materialId, completedAt: { not: null } },
      include: { questionAttempts: { select: { questionId: true } } },
      orderBy: [{ score: "desc" }, { completedAt: "desc" }],
    });

    const current = attempts.filter((attempt) => {
      const answered = new Set(
        attempt.questionAttempts.map((answer) => answer.questionId),
      );
      return (
        answered.size === currentIds.size &&
        [...answered].every((id) => currentIds.has(id))
      );
    });

    return {
      best: current[0] ?? null,
      questionCount: currentIds.size,
      /** True when the student has a finished attempt, but at an older set. */
      hasOutdated: current.length === 0 && attempts.length > 0,
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

    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: attempt.courseMaterialId },
      select: { quizMode: true },
    });
    if (material?.quizMode === QuizMode.test) {
      throw new BadRequestException(
        "Тест перевіряється цілком: надішліть усі відповіді разом",
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
    const bestScore = await this.recordMaterialProgress(
      attempt.courseMaterialId,
      userId,
      score,
      completedAt,
    );

    /**
     * Both numbers travel together so the interface never has to guess which it is
     * showing: a student who does worse on a retry saw their score drop on the page
     * and then rise again after a reload, with nothing to explain either.
     */
    return { score, best_score: bestScore, total: questionCount, correct: correctCount };
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

  /**
   * Whether this attempt may see the answer key.
   *
   * Practice always may — that is the whole point of it. A test only after it has been
   * passed: the questions are a fixed set rather than drawn from a pool, so revealing
   * them after a failure would turn the retake into copying. A failed test still shows
   * which questions were wrong, which is what tells the student where to go back to.
   */
  private mayRevealAnswers(
    material: { quizMode: QuizMode | null; passingScore: number | null },
    score: number,
  ): boolean {
    if (material.quizMode !== QuizMode.test) return true;
    if (material.passingScore == null) return true;
    return score >= material.passingScore;
  }

  private async recordMaterialProgress(
    courseMaterialId: string,
    userId: string,
    score: number,
    completedAt: Date,
  ): Promise<number> {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: courseMaterialId },
      include: { module: true },
    });
    const courseId = material?.module?.courseId;
    if (!courseId) return score;

    /**
     * The best attempt is what counts, however many there were: a student who retries
     * and does worse should not lose the result they already earned. `completedAt` is
     * always refreshed, so the material still reads as recently worked on.
     */
    const { best } = await this.bestCurrentAttempt(courseMaterialId, userId);
    const previousBest = best?.score != null ? Number(best.score) : null;
    const bestScore =
      previousBest != null ? Math.max(previousBest, score) : score;

    await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId_courseMaterialId: { userId, courseId, courseMaterialId },
      },
      create: { userId, courseId, courseMaterialId, completedAt, score },
      update: { completedAt, score: bestScore },
    });

    return bestScore;
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

    const bestScore = await this.recordMaterialProgress(
      attempt.courseMaterialId,
      userId,
      score,
      completedAt,
    );

    const material = await this.prisma.courseMaterial.findUniqueOrThrow({
      where: { id: attempt.courseMaterialId },
      select: { quizMode: true, passingScore: true },
    });
    const reveal = this.mayRevealAnswers(material, score);

    return {
      attempt: this.toAttemptResponse(updated),
      score,
      best_score: bestScore,
      total,
      correct: correctCount,
      mode: material.quizMode ?? QuizMode.practice,
      passing_score: material.passingScore,
      passed: material.passingScore == null ? null : score >= material.passingScore,
      reveal_answers: reveal,
      results: results.map((result) =>
        reveal
          ? {
              ...result,
              accepted_answers: describeAcceptedAnswers(
                questionsById.get(result.question_id)!,
              ),
            }
          : {
              question_id: result.question_id,
              correct: result.correct,
              quality: result.quality,
              explanation: null,
              accepted_answers: [],
            },
      ),
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
