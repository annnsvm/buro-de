"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../generated/prisma/client");
function createPgAdapter(connectionString) {
    const useSsl = connectionString.includes('.render.com') ||
        /sslmode=(require|verify-full|verify-ca)/i.test(connectionString);
    return new adapter_pg_1.PrismaPg(Object.assign({ connectionString, max: 5, idleTimeoutMillis: 60000, keepAlive: true }, (useSsl ? { ssl: { rejectUnauthorized: false } } : {})));
}
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL is not set. Please configure it in your .env file.');
        }
        const adapter = createPgAdapter(connectionString);
        super({ adapter });
    }
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('[Prisma] Connected to PostgreSQL');
        }
        catch (error) {
            console.error('[Prisma] Failed to connect to PostgreSQL', error);
            throw error;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map