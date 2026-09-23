import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export type ImportMode = 'practice' | 'test';

export type ImportTarget = {
  title: string;
  existingMaterialId: string | null;
  questionCount: number;
  points: number;
  typeCounts: Record<string, number>;
  /** Wordings the explanation calls acceptable; confirmed by a person, not assumed. */
  alternatives: Array<{ id: string; prompt: string; wordings: string[] }>;
};

export type ImportPreview = {
  mode: ImportMode;
  targets: ImportTarget[];
  totalQuestions: number;
  problems: Array<{ row: number; id: string; message: string }>;
  unusable: Array<{ id: string; reasons: string[] }>;
  created?: number;
  updated?: number;
};

/**
 * Sends the file for inspection or for writing. The dry run is the default so a
 * mistyped file can never reach a course without someone having looked at it first.
 */
export const importQuestions = async (
  courseId: string,
  moduleId: string,
  body: {
    csv: string;
    mode: ImportMode;
    dry_run: boolean;
    passing_score?: number;
    accept_alternatives?: boolean;
  },
): Promise<ImportPreview> => {
  const { data } = await apiInstance.post<ImportPreview>(
    API_ENDPOINTS.courseMaterials.import(courseId, moduleId),
    body,
  );
  return data;
};
