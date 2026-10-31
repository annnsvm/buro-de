import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/** Mirrors the PracticeBlock enum on the server. */
export type PracticeBlockId =
  | 'grammatik'
  | 'lesen'
  | 'horen'
  | 'sprechen'
  | 'schreiben';

/**
 * One block of a lesson's practice.
 *
 * `done` is about having answered, not about having been right: the score is reported so the
 * student sees how they did, but it never stands between them and finishing the lesson.
 */
export type PracticeBlockSummary = {
  block: PracticeBlockId;
  total: number;
  answered: number;
  correct: number;
  done: boolean;
  /**
   * Speaking and writing: offered and worth doing, but not counted towards finishing the
   * practice, because one is marked by the student and the other costs a paid check.
   */
  optional: boolean;
  /** Texts, recordings or tasks inside it - what a block that asks no questions holds. */
  task_count: number;
  /**
   * The mark for a block scored out of criteria rather than questions - a letter is marked
   * out of the author's rubric, and counting its questions would report 0 of 0.
   */
  points: { score: number; max: number } | null;
};

export type PracticeOverview = {
  material_id: string;
  /** The teacher's own name for the practice; the hub prefers it over a generic heading. */
  title: string;
  module_title: string | null;
  lesson_title: string | null;
  blocks: PracticeBlockSummary[];
  done_count: number;
  total_count: number;
};

export const fetchPracticeOverview = async (
  materialId: string,
): Promise<PracticeOverview> => {
  const { data } = await apiInstance.get<PracticeOverview>(
    API_ENDPOINTS.practice.overview(materialId),
  );
  return data;
};
