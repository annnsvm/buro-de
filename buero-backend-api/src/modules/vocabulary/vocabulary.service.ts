import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';

/**
 * A student's own word list. Every query is scoped by userId, so one account can
 * never read or change another's words — the former global table had no owner and
 * was visible to everybody.
 */
@Injectable()
export class VocabularyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string, search?: string) {
    const trimmed = search?.trim();
    return this.prisma.userVocabularyEntry.findMany({
      where: {
        userId,
        ...(trimmed && {
          OR: [
            { word: { contains: trimmed, mode: 'insensitive' } },
            { translation: { contains: trimmed, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateVocabularyDto) {
    try {
      return await this.prisma.userVocabularyEntry.create({
        data: {
          userId,
          word: dto.word.trim(),
          translation: dto.translation.trim(),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
          ...(dto.course_id !== undefined && { courseId: dto.course_id }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Слово "${dto.word}" вже є у вашому словнику`,
        );
      }
      throw error;
    }
  }

  async update(userId: string, id: string, dto: UpdateVocabularyDto) {
    await this.findOwnedEntry(userId, id);
    try {
      return await this.prisma.userVocabularyEntry.update({
        where: { id },
        data: {
          ...(dto.word !== undefined && { word: dto.word.trim() }),
          ...(dto.translation !== undefined && {
            translation: dto.translation.trim(),
          }),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Слово "${dto.word}" вже є у вашому словнику`,
        );
      }
      throw error;
    }
  }

  async delete(userId: string, id: string) {
    await this.findOwnedEntry(userId, id);
    await this.prisma.userVocabularyEntry.delete({ where: { id } });
    return { deleted: true, id };
  }

  /**
   * Looks the entry up by id *and* owner. Someone else's id therefore reads as
   * "not found" rather than being edited or revealed.
   */
  private async findOwnedEntry(userId: string, id: string) {
    const entry = await this.prisma.userVocabularyEntry.findFirst({
      where: { id, userId },
    });
    if (!entry) {
      throw new NotFoundException('Слово не знайдено у вашому словнику');
    }
    return entry;
  }
}
