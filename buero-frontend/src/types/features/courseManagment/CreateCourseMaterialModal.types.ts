/**
 * How a quiz material behaves, and the only place the choice is made.
 *
 * `practice` is the check after a lesson: each answer is marked the moment it is given,
 * along with the explanation, and the result is the share of questions answered right.
 * `test` is the check after a module: nothing is marked until everything has been
 * answered, the result is counted in the points the author gave each task, and the
 * answer key stays back unless the student reached the threshold.
 */
export type QuizMaterialMode = 'practice' | 'test';

/**
 * A writing task while it is being authored. The criteria are the teacher's own sentences,
 * shown to the student, sent to the grader, and quoted beside the mark.
 */
export type WritingTaskDraft = {
  task: string;
  minSentences: number;
  maxSentences: number;
  criteria: string[];
  modelAnswer: string;
};

export type CreateCourseMaterialModalValues =
  | {
      type: 'video';
      title: string;
      youtubeVideoId: string;
      youtubeVideoDuration: string;
    }
  | {
      type: 'quiz';
      title: string;
      quizMode: QuizMaterialMode;
      /** Percentage needed to pass; only meaningful for a test. */
      passingScore: number | null;
    }
  | {
      type: 'writing';
      title: string;
      writing: WritingTaskDraft;
    };

export type CreateCourseMaterialModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onCreateMaterial: (values: CreateCourseMaterialModalValues) => Promise<void>;
};
