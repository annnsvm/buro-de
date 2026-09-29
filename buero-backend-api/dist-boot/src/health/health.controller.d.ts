import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHealth(): {
        status: string;
        timestamp: string;
    };
    getDbHealth(): Promise<{
        database: string;
        timestamp: string;
    }>;
}
