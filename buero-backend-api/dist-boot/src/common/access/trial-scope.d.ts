import { PrismaService } from "../../prisma/prisma.service";
export declare const TRIAL_FREE_MODULE_COUNT = 2;
export declare const getTrialModuleIds: (prisma: PrismaService, courseId: string) => Promise<string[]>;
