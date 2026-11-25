export type CourseDurationSectionProps = {
  /** Added up from the videos in the course, in minutes. */
  durationMinutes: number;
  videoLessonsCount: number;
  /** True when the author has given their own figure and the sum has stood down. */
  manual: boolean;
  /** The author's figure, in whole hours, as typed. */
  hours: string;
  onHoursChange: (hours: string) => void;
  onManualChange: (manual: boolean) => void;
  disabled?: boolean;
  error?: string;
};
