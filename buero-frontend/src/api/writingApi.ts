import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/** One criterion's verdict, with the sentence of explanation the student reads. */
export type CriterionVerdict = {
  id: number;
  met: boolean;
  note: string;
};

export type WritingBest = {
  score: number;
  assessment: { criteria: CriterionVerdict[] };
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
  attempts_per_window: number;
  can_submit: boolean;
  attempts_left: number;
  blocked_reason: 'wait' | 'daily' | 'budget' | null;
  retry_at: string | null;
  best: WritingBest | null;
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
      assessment: { criteria: CriterionVerdict[] };
      attempts_left: number;
    }
  | {
      status: 'needs_more';
      reason: 'too_short' | 'no_salutation' | 'no_closing' | 'too_long';
      body_sentences: number;
      min_sentences: number;
      max_sentences: number;
      attempts_left: number;
    }
  | {
      status: 'blocked';
      reason: 'wait' | 'daily' | 'budget';
      retry_at: string | null;
      self_check: boolean;
      model_answer: string | null;
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
