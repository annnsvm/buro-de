import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/**
 * One criterion's verdict, in the shape the checker returns now.
 *
 * `comment` is empty whenever the point was given: the student sees a tick, and a sentence
 * explaining a point they already have is noise.
 */
export type CriterionMark = {
  n: number;
  point: 0 | 1;
  comment: string;
};

/** @deprecated The shape attempts graded before the amendment were stored in. */
export type CriterionVerdict = {
  id: number;
  met: boolean;
  note: string;
};

/** What to fix, as wrong -> right -> why. At most three. */
export type Correction = {
  wrong: string;
  right: string;
  why: string;
};

/**
 * The feedback on one attempt.
 *
 * Both shapes appear, and both have to render: attempts graded before the amendment are stored
 * with `id`/`met`/`note` and are not going to be re-marked. `readMarks` below is the one place
 * that knows the difference.
 */
export type WritingAssessment = {
  criteria: Array<CriterionMark | CriterionVerdict>;
  corrections?: Correction[];
  praise?: string;
  summary?: string;
};

export type WritingBest = {
  score: number;
  assessment: WritingAssessment;
  text: string;
  submitted_at: string;
};

/** One attempt the student made, with what the checker said about it. */
export type WritingAttempt = {
  score: number;
  max_score: number;
  assessment: WritingAssessment;
  text: string;
  submitted_at: string;
};

/**
 * The task as the student meets it - condition, criteria and how many goes are left.
 *
 * The criteria arrive before anything is written, on purpose: being marked against a list you
 * were never shown is what makes automatic grading feel arbitrary.
 */
export type WritingTaskResponse = {
  task: string;
  criteria: string[];
  min_sentences: number;
  max_sentences: number;
  max_score: number;
  attempts_used: number;
  /** The student's whole allowance: what the course grants plus what a teacher added. */
  attempts_per_window: number;
  can_submit: boolean;
  attempts_left: number;
  /**
   * Why the box is closed. `used_up` is final for this task until a teacher grants more;
   * `cooldown` means only that the last check was moments ago.
   */
  blocked_reason: 'cooldown' | 'daily' | 'used_up' | 'budget' | null;
  retry_at: string | null;
  best: WritingBest | null;
  /** Every attempt, newest first. What the student works from once the allowance is spent. */
  attempts: WritingAttempt[];
};

/**
 * What comes back from a submission, in three shapes.
 *
 * `needs_more` is not a failure: the letter was too short or missing a formula, nothing was
 * spent and no attempt was counted. `blocked` with `self_check` means the monthly budget has
 * gone and the task falls back to marking yourself against the model answer.
 */
export type WritingSubmitResponse =
  | {
      status: 'graded';
      repeated: boolean;
      score: number;
      max_score: number;
      assessment: WritingAssessment;
      attempts_left: number;
    }
  | {
      status: 'needs_more';
      /**
       * None of these costs a check: every one of them is settled before the checker is called.
       *
       * `no_salutation` and `no_closing` used to be among them, guessed from the text. The rubric
       * decides whether a text needs either, in the author's words, so the server stopped
       * producing them and they are gone from here too.
       */
      reason:
        | 'too_short'
        | 'too_long'
        | 'not_german'
        | 'already_sent'
        | 'copied';
      body_sentences: number;
      min_sentences: number;
      max_sentences: number;
      attempts_left: number;
    }
  | {
      status: 'blocked';
      reason: 'cooldown' | 'daily' | 'used_up' | 'budget';
      retry_at: string | null;
      self_check: boolean;
      model_answer: string | null;
    }
  /**
   * The checker answered twice with something we could not read.
   *
   * Our fault, so it costs the student nothing: the check is still theirs and the attempt was
   * never recorded. Told apart from `blocked` because there is nothing for them to do about it
   * except come back.
   */
  | {
      status: 'unavailable';
      attempts_left: number;
    };

/**
 * One writing task of a practice's Schreiben block.
 *
 * The same shape as a writing material's task, with the id of the task itself, because a block
 * may hold more than one and each keeps its own attempts.
 */
export type PracticeWritingTask = WritingTaskResponse & {
  element_id: string;
  title: string | null;
};

export type PracticeWritingResponse = {
  tasks: PracticeWritingTask[];
  /**
   * Tasks that cannot be marked yet - no rubric, or no length to count against. Named rather
   * than hidden: one unfinished task must not take the block down, and it must not vanish.
   */
  unusable: Array<{ element_id: string; title: string; reason: string }>;
};

export const fetchPracticeWritingTasks = async (
  materialId: string,
): Promise<PracticeWritingResponse> => {
  const { data } = await apiInstance.get<PracticeWritingResponse>(
    API_ENDPOINTS.writing.practiceTasks(materialId),
  );
  return data;
};

export const submitPracticeWriting = async (
  elementId: string,
  text: string,
): Promise<WritingSubmitResponse> => {
  const { data } = await apiInstance.post<WritingSubmitResponse>(
    API_ENDPOINTS.writing.submitPractice(elementId),
    { text },
  );
  return data;
};

export const fetchWritingTask = async (
  materialId: string,
): Promise<WritingTaskResponse> => {
  const { data } = await apiInstance.get<WritingTaskResponse>(
    API_ENDPOINTS.writing.task(materialId),
  );
  return data;
};

export const submitWriting = async (
  materialId: string,
  text: string,
): Promise<WritingSubmitResponse> => {
  const { data } = await apiInstance.post<WritingSubmitResponse>(
    API_ENDPOINTS.writing.submit(materialId),
    { text },
  );
  return data;
};
