import { z } from 'zod';
export declare const writingTask: z.ZodObject<{
    task: z.ZodString;
    minSentences: z.ZodNumber;
    maxSentences: z.ZodNumber;
    criteria: z.ZodArray<z.ZodString>;
    modelAnswer: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type WritingTask = z.infer<typeof writingTask>;
export declare class InvalidWritingTaskError extends Error {
}
export declare const parseWritingTask: (content: unknown) => WritingTask;
export declare const MODULE_4_LETTER: WritingTask;
