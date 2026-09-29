import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

/** Mirrors the PracticeBlock enum on the server. */
export type PracticeBlockId = 'grammatik' | 'lesen' | 'horen' | 'sprechen';

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
