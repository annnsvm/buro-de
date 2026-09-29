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
exports.VocabularyService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
let VocabularyService = class VocabularyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllForUser(userId, search) {
        const trimmed = search === null || search === void 0 ? void 0 : search.trim();
        return this.prisma.userVocabularyEntry.findMany({
            where: Object.assign({ userId }, (trimmed && {
                OR: [
                    { word: { contains: trimmed, mode: 'insensitive' } },
                    { translation: { contains: trimmed, mode: 'insensitive' } },
                ],
            })),
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(userId, dto) {
        try {
            return await this.prisma.userVocabularyEntry.create({
                data: Object.assign(Object.assign(Object.assign({ userId, word: dto.word.trim(), translation: dto.translation.trim() }, (dto.category !== undefined && { category: dto.category })), (dto.notes !== undefined && { notes: dto.notes })), (dto.course_id !== undefined && { courseId: dto.course_id })),
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException(`Слово "${dto.word}" вже є у вашому словнику`);
            }
            throw error;
        }
    }
    async update(userId, id, dto) {
        await this.findOwnedEntry(userId, id);
        try {
            return await this.prisma.userVocabularyEntry.update({
                where: { id },
                data: Object.assign(Object.assign(Object.assign(Object.assign({}, (dto.word !== undefined && { word: dto.word.trim() })), (dto.translation !== undefined && {
                    translation: dto.translation.trim(),
                })), (dto.category !== undefined && { category: dto.category })), (dto.notes !== undefined && { notes: dto.notes })),
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new common_1.ConflictException(`Слово "${dto.word}" вже є у вашому словнику`);
            }
            throw error;
        }
    }
    async delete(userId, id) {
        await this.findOwnedEntry(userId, id);
        await this.prisma.userVocabularyEntry.delete({ where: { id } });
        return { deleted: true, id };
    }
    async findOwnedEntry(userId, id) {
        const entry = await this.prisma.userVocabularyEntry.findFirst({
            where: { id, userId },
        });
        if (!entry) {
            throw new common_1.NotFoundException('Слово не знайдено у вашому словнику');
        }
        return entry;
    }
};
exports.VocabularyService = VocabularyService;
exports.VocabularyService = VocabularyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VocabularyService);
//# sourceMappingURL=vocabulary.service.js.map