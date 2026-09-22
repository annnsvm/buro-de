export type TrialSidebarBlurTailProps = {
  courseId: string;
  previewModule?: { number: number; title: string; materialCount: number } | null;
  /** Zero-based number of the first locked module, shown in the teaser header. */
  moduleNumber?: number;
  /** Full course price, so a trial student can always see what unlocking costs. */
  price?: number | null;
};
