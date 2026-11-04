export type CourseTrialSectionProps = {
  /** Kept as typed text, like the other numeric fields of this form. */
  trialModuleCount: string;
  /** How many modules the course has today, so the figure can be judged against it. */
  moduleCount: number;
  error?: string;
  disabled?: boolean;
  onChangeTrialModuleCount: (value: string) => void;
};
