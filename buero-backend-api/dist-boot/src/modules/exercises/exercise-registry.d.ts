import { QuestionType } from '../../generated/prisma/enums';
import type { ExerciseDefinition, GradableQuestion, GradeResult, RawAnswer } from './exercise.types';
export declare const getExerciseDefinition: (type: QuestionType) => ExerciseDefinition | undefined;
export declare const supportedQuestionTypes: () => QuestionType[];
export declare const gradeAnswer: (question: GradableQuestion, answer: RawAnswer) => GradeResult;
export declare const describeAcceptedAnswers: (question: GradableQuestion) => string[];
export declare const validateQuestion: (question: GradableQuestion) => string[];
