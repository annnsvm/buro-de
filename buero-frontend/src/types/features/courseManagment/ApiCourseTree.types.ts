import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type ApiCourseTreeResponse = {
  title?: string;
  description?: string | null;
  language?: string;
  category?: string;
  price?: number | null;
  durationHours?: number | null;
  duration_hours?: number | null;
  /** Whether the hours above were typed rather than summed from the videos. */
  durationHoursManual?: boolean | null;
  duration_hours_manual?: boolean | null;
  level?: string | null;
  /** Top of the level range, when the course covers more than one. */
  levelTo?: string | null;
  trialModuleCount?: number | null;
  trial_module_count?: number | null;
  /** Whether the course sits in the integration half of the catalogue. */
  isIntegration?: boolean | null;
  isPublished?: boolean;
  is_published?: boolean;
  image_url?: string | null;
  imageUrl?: string | null;
  modules?: Modules[];
};
