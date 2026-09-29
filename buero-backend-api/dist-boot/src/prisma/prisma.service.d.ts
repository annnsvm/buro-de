import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    constructor();
    onModuleInit(): Promise<void>;
}
