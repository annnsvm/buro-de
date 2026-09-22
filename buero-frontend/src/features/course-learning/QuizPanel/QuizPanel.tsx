import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  answerQuizQuestion,
  fetchLastQuizAttempt,
  fetchQuizQuestions,
  startQuizAttempt,
  submitQuizAttempt,
  type AnswerQuestionResponse,
  type QuizMode,
  type QuizQuestion,
} from '@/api/quizApi';
import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import LessonAttachments from '@/features/course-learning/MaterialWindow/LessonAttachments';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';
import { getExerciseRenderer } from '@/features/course-learning/exercises/exerciseRenderers';
import {
  isAnswered,
  type ExerciseAnswer,
} from '@/features/course-learning/exercises/exercise.types';

export type QuizResultSummary = {
  correct: number;
  total: number;
  /** This attempt. */
  percent: number;
  /** The highest across all attempts — what actually counts as the result. */
  bestPercent: number;
  /** False when the result was restored on opening rather than just earned. */
  justFinished: boolean;
};

export type QuizPanelProps = {
  courseMaterialId: string;
  courseId?: string;
  moduleId?: string;
  quizMaterialTitle: string;
  attachments?: MaterialAttachment[];
  onQuizResult?: (result: QuizResultSummary | null) => void;
};

/**
 * The quiz as a step of the lesson rather than a dialog on top of one.
 *
 * Each answer is checked the moment it is given: the student sees straight away
 * whether it was right and reads the explanation while the question is still in mind,
 * which is what makes a practice quiz teach rather than merely test. An answered
 * question locks, because feedback that can be acted on is just the answer key.
 */
const QuizPanel: React.FC<QuizPanelProps> = ({
  courseMaterialId,
  courseId,
  moduleId,
  quizMaterialTitle,
  attachments,
  onQuizResult,
}) => {
  const { t } = useTranslation();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [drafts, setDrafts] = useState<Record<string, ExerciseAnswer>>({});
  const [feedback, setFeedback] = useState<Record<string, AnswerQuestionResponse>>({});
  const [checking, setChecking] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResultSummary | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [mode, setMode] = useState<QuizMode>('practice');
  const [passingScore, setPassingScore] = useState<number | null>(null);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = questions.length;
  const answeredCount = Object.keys(feedback).length;

  /**
   * Opens the quiz without starting anything.
   *
   * A finished attempt is replayed instead, so coming back to a lesson shows what was
   * answered rather than a blank form. No attempt row is created here either: one used
   * to be written the moment the quiz was opened, which filled the table with empty
   * attempts nobody ever answered.
   */
  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setStartError(null);
    setAttemptId(null);
    try {
      const [loaded, previous] = await Promise.all([
        fetchQuizQuestions(courseMaterialId),
        fetchLastQuizAttempt(courseMaterialId),
      ]);
      setQuestions(loaded.questions);
      setMode(loaded.mode);
      setPassingScore(loaded.passing_score);

      if (previous) {
        setPassed(previous.passed);
        setAttemptId(previous.attempt_id);
        setDrafts(
          Object.fromEntries(
            previous.answers.map((answer) => [answer.question_id, answer.raw_answer]),
          ),
        );
        setFeedback(
          Object.fromEntries(
            previous.answers.map((answer) => [
              answer.question_id,
              {
                ...answer,
                answered: previous.answers.length,
                total: previous.total,
                summary: null,
              },
            ]),
          ),
        );
        const summary: QuizResultSummary = {
          correct: previous.correct,
          total: previous.total,
          percent: Math.round(previous.score),
          bestPercent: Math.round(previous.score),
          justFinished: false,
        };
        setResult(summary);
        onQuizResult?.(summary);
      }
    } catch (err: unknown) {
      setStartError(getErrorMessage(err, t('quiz.startFailed')));
    } finally {
      setLoading(false);
    }
  }, [courseMaterialId, onQuizResult, t]);

  useEffect(() => {
    void loadQuiz();
  }, [loadQuiz]);

  /** The attempt is created by the first answer, not by opening the quiz. */
  const ensureAttempt = useCallback(async (): Promise<string> => {
    if (attemptId) return attemptId;
    const attempt = await startQuizAttempt(courseMaterialId);
    setAttemptId(attempt.id);
    return attempt.id;
  }, [attemptId, courseMaterialId]);

  const setDraft = useCallback((questionId: string, answer: ExerciseAnswer) => {
    setAnswerError(null);
    setDrafts((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const check = useCallback(
    async (question: QuizQuestion) => {
      const answer = drafts[question.id];
      if (!isAnswered(answer) || feedback[question.id]) return;

      setChecking(question.id);
      setAnswerError(null);
      try {
        const currentAttemptId = await ensureAttempt();
        const data = await answerQuizQuestion(currentAttemptId, {
          question_id: question.id,
          answer,
        });
        setFeedback((prev) => ({ ...prev, [question.id]: data }));
        if (data.summary) {
          const summary: QuizResultSummary = {
            correct: data.summary.correct,
            total: data.summary.total,
            percent: Math.round(data.summary.score),
            bestPercent: Math.round(data.summary.best_score),
            justFinished: true,
          };
          setResult(summary);
          setResultDialogOpen(true);
          onQuizResult?.(summary);
        }
      } catch (err: unknown) {
        setAnswerError(getErrorMessage(err, t('quiz.submitFailed')));
      } finally {
        setChecking(null);
      }
    },
    [drafts, ensureAttempt, feedback, onQuizResult, t],
  );

  /**
   * Picking one option is already a complete answer, so it is sent for checking as
   * soon as it is committed to state. Typed answers and word order are not complete
   * until the student says they are, so those get their own confirm button.
   */
  useEffect(() => {
    // A test is never marked one answer at a time; it is submitted as a whole.
    if (mode === 'test') return;
    const pending = questions.find(
      (question) =>
        question.type === 'single_choice' &&
        !feedback[question.id] &&
        isAnswered(drafts[question.id]) &&
        checking !== question.id,
    );
    if (pending) void check(pending);
  }, [mode, questions, drafts, feedback, checking, check]);

  /** Clears the screen; the next answer starts a fresh attempt on the server. */
  const handleRetry = useCallback(() => {
    setResult(null);
    setResultDialogOpen(false);
    setFeedback({});
    setDrafts({});
    setAnswerError(null);
    setAttemptId(null);
    setPassed(null);
    onQuizResult?.(null);
  }, [onQuizResult]);

  /**
   * A test is checked in one go. Nothing has been marked until now, so this is the
   * first moment the student learns anything — and if they did not pass, the answer
   * key is deliberately not part of what comes back.
   */
  const submitTest = useCallback(async () => {
    const unanswered = questions.filter((q) => !isAnswered(drafts[q.id]));
    if (unanswered.length > 0) {
      setAnswerError(t('quiz.answerAllFirst', { count: unanswered.length }));
      return;
    }
    setSubmitting(true);
    setAnswerError(null);
    try {
      const currentAttemptId = await ensureAttempt();
      const data = await submitQuizAttempt(currentAttemptId, {
        answers: questions.map((question) => ({
          question_id: question.id,
          answer: drafts[question.id] ?? '',
        })),
      });
      setFeedback(
        Object.fromEntries(
          data.results.map((item) => [
            item.question_id,
            {
              ...item,
              answered: data.total,
              total: data.total,
              summary: null,
            },
          ]),
        ),
      );
      setPassed(data.passed);
      const summary: QuizResultSummary = {
        correct: data.correct,
        total: data.total,
        percent: Math.round(data.score),
        bestPercent: Math.round(data.best_score),
        justFinished: true,
      };
      setResult(summary);
      setResultDialogOpen(true);
      onQuizResult?.(summary);
    } catch (err: unknown) {
      setAnswerError(getErrorMessage(err, t('quiz.submitFailed')));
    } finally {
      setSubmitting(false);
    }
  }, [drafts, ensureAttempt, onQuizResult, questions, t]);


  if (loading) {
    return (
      <p className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
        {t('quiz.preparing')}
      </p>
    );
  }

  if (startError) {
    return (
      <div className="space-y-4 px-6 py-12 text-center">
        <p className="text-sm text-[var(--color-error)]">{startError}</p>
        <button
          type="button"
          onClick={() => void loadQuiz()}
          className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {t('quiz.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-6 sm:px-6">
      <h2 className="pt-6 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
        {quizMaterialTitle || t('quiz.title')}
      </h2>

      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
        {mode === 'test'
          ? t('quiz.testIntro', { passing: passingScore ?? 0 })
          : t('quiz.answeredCount', { answered: answeredCount, total })}
      </p>

      {total === 0 ? (
        <p className="py-12 text-center text-[var(--color-text-secondary)]">
          {t('quiz.noQuestions')}
        </p>
      ) : (
        <ol className="mt-6 list-none space-y-8 p-0">
          {questions.map((question, index) => {
            const Renderer = getExerciseRenderer(question.type);
            const given = feedback[question.id];
            const locked =
              Boolean(given) || checking === question.id || submitting;
            const needsConfirm =
              mode === 'practice' &&
              question.type !== 'single_choice' &&
              !given &&
              isAnswered(drafts[question.id]);

            return (
              <li
                key={question.id}
                className={[
                  'scroll-mt-20 rounded-2xl border-l-4 p-4 transition-colors sm:p-6',
                  given
                    ? given.correct
                      ? 'border-[var(--color-success)] bg-[var(--color-success-soft)]'
                      : 'border-[var(--color-error)] bg-[var(--color-error-soft)]'
                    : 'border-transparent bg-[var(--color-surface-section)]',
                ].join(' ')}
              >
                <p className="text-xs font-bold tracking-wider text-[var(--color-text-secondary)] uppercase">
                  {t('quiz.questionPosition', { current: index + 1, total })}
                </p>
                <p className="mt-2 text-base font-bold text-[var(--color-text-primary)]">
                  {question.prompt}
                </p>

                <div className="mt-4">
                  {Renderer ? (
                    <Renderer
                      question={question}
                      answer={drafts[question.id] ?? ''}
                      onChange={(value) => setDraft(question.id, value)}
                      disabled={locked}
                    />
                  ) : (
                    <p className="text-sm text-[var(--color-error)]">
                      {t('quiz.unsupportedType')}
                    </p>
                  )}
                </div>

                {needsConfirm ? (
                  <button
                    type="button"
                    onClick={() => void check(question)}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    {t('quiz.checkAnswer')}
                  </button>
                ) : null}

                {given ? <QuestionFeedback given={given} /> : null}
              </li>
            );
          })}
        </ol>
      )}

      <LessonAttachments
        attachments={attachments}
        courseId={courseId}
        moduleId={moduleId}
        materialId={courseMaterialId}
      />

      {answerError ? (
        <p className="mt-6 text-center text-sm text-[var(--color-error)]" role="alert">
          {answerError}
        </p>
      ) : null}

      {mode === 'test' && !result ? (
        <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-4 py-3 sm:-mx-6 sm:px-6">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => void submitTest()}
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[220px]"
            >
              {submitting ? t('quiz.submitting') : t('quiz.submitTest')}
            </button>
          </div>
        </div>
      ) : null}

      {result ? (
        <div
          className="mt-10 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-section)] px-6 py-6 text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {t('quiz.yourBestResult')}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--color-primary)]">
            {result.bestPercent}%
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {t('quiz.scoreSummary', {
              correct: result.correct,
              total: result.total,
            })}
          </p>
          {/**
           * Only worth saying when the two differ: otherwise the student is told the
           * same number twice. It is what explains a score that went down on a retry.
           */}
          {result.justFinished && result.percent !== result.bestPercent ? (
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              {t('quiz.thisAttempt', { percent: result.percent })}
            </p>
          ) : null}
          {passed === false ? (
            <p className="mt-3 text-sm text-[var(--color-text-primary)]">
              {t('quiz.testFailedHint', { passing: passingScore ?? 0 })}
            </p>
          ) : null}
          {passed === true ? (
            <p className="mt-3 text-sm font-semibold text-[var(--color-success-text)]">
              {t('quiz.testPassed')}
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleRetry}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] px-8 py-3 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-section)] sm:w-auto sm:min-w-[220px]"
          >
            {t('quiz.oneMoreTime')}
          </button>
        </div>
      ) : null}

      {/**
       * Announced the moment the last question is answered, so the score is not
       * something the student has to go looking for. Dismissing it leaves the same
       * numbers on the page below the questions.
       */}
      {result ? (
        <BaseDialog
          isOpen={resultDialogOpen}
          handleOpenChange={setResultDialogOpen}
          openCloseAnimation
          contentClassName="relative z-[1] w-[min(92vw,420px)] rounded-2xl bg-[var(--color-neutral-white)] px-6 py-8 text-center shadow-xl focus:outline-none"
        >
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            {t('quiz.yourResult')}
          </p>
          <p className="mt-3 text-4xl font-bold tabular-nums text-[var(--color-primary)]">
            {result.percent}%
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {t('quiz.scoreSummary', {
              correct: result.correct,
              total: result.total,
            })}
          </p>
          {result.percent !== result.bestPercent ? (
            <p className="mt-3 text-sm text-[var(--color-text-primary)]">
              {t('quiz.bestStays', { percent: result.bestPercent })}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setResultDialogOpen(false)}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {t('quiz.seeMistakes')}
          </button>
        </BaseDialog>
      ) : null}
    </div>
  );
};

/** The verdict, the right wording when it was missed, and why. */
const QuestionFeedback: React.FC<{ given: AnswerQuestionResponse }> = ({ given }) => {
  const { t } = useTranslation();
  const nearMiss =
    given.correct && given.quality === 'case'
      ? t('quiz.nearMissCase')
      : given.correct && given.quality === 'typo'
        ? t('quiz.nearMissTypo')
        : null;

  return (
    <div className="mt-4 text-sm">
      <p
        className={[
          'font-semibold',
          given.correct
            ? 'text-[var(--color-success-text)]'
            : 'text-[var(--color-error)]',
        ].join(' ')}
      >
        {given.correct ? t('quiz.answerCorrect') : t('quiz.answerWrong')}
      </p>

      {nearMiss ? (
        <p className="mt-1 text-[var(--color-text-secondary)]">{nearMiss}</p>
      ) : null}

      {!given.correct && given.accepted_answers.length > 0 ? (
        <p className="mt-2 text-[var(--color-text-primary)]">
          {t('quiz.correctAnswerIs')}{' '}
          <span className="font-semibold">{given.accepted_answers[0]}</span>
        </p>
      ) : null}

      {given.explanation ? (
        <p className="mt-2 text-[var(--color-text-primary)]">{given.explanation}</p>
      ) : null}
    </div>
  );
};

export default QuizPanel;
