export type TrialSidebarBlurTailProps = {
  courseId: string;
  previewModule?: { number: number; title: string; materialCount: number } | null;
  /** Zero-based number of the first locked module, shown in the teaser header. */
  moduleNumber?: number;
};
