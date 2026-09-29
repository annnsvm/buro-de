import Anthropic from '@anthropic-ai/sdk';
import { type PreCheck } from './letter-shape';
import { type WritingAssessment } from './rubric';
import type { WritingTask } from './writing-task';
export type Usage = {
    inputTokens: number;
    outputTokens: number;
};
export type GradeResult = {
    status: 'graded';
    score: number;
    assessment: WritingAssessment;
    calledModel: true;
    usage: Usage;
} | {
    status: 'rejected';
    reason: Extract<PreCheck, {
        ok: false;
    }>['reason'];
    calledModel: false;
};
export declare const gradeLetter: (task: WritingTask, letter: string, client?: Anthropic) => Promise<GradeResult>;
