import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * A student's own notes on a lesson.
 *
 * Kept on the server, not in the browser, and that is the whole point of the module: a note is
 * worth keeping for as long as the course is. Someone opening a lesson again half a year later,
 * on another machine, has to find what they wrote - which nothing stored per browser can promise.
 *
 * Every query is scoped by `userId`. There is no route that reads another account's notes and
 * none that lists everybody's: a note is private writing, not course content.
 */
@Injectable()
export class LessonNotesService {
  constructor(private readonly prisma: PrismaService) {}

  /** A lesson with no note yet answers with an empty one rather than a 404. */
  async read(userId: string, courseMaterialId: string) {
    const note = await this.prisma.lessonNote.findUnique({
      where: { userId_courseMaterialId: { userId, courseMaterialId } },
    });

    return {
      text: note?.text ?? '',
      updated_at: note?.updatedAt?.toISOString() ?? null,
    };
  }

  /**
   * Saves the note, replacing whatever was there.
   *
   * One row per student per lesson, so this is an upsert: the student is writing one note and
   * editing it, not filing a new one on every keystroke.
   */
  async save(userId: string, courseMaterialId: string, text: string) {
    await this.assertMaterialExists(courseMaterialId);

    /**
     * An emptied box removes the note instead of storing a blank one. The student cleared it
     * deliberately, and keeping an empty row would leave a "last edited" time for nothing.
     */
    if (!text.trim()) {
      await this.prisma.lessonNote.deleteMany({
        where: { userId, courseMaterialId },
      });
      return { text: '', updated_at: null };
    }

    const note = await this.prisma.lessonNote.upsert({
      where: { userId_courseMaterialId: { userId, courseMaterialId } },
      create: { userId, courseMaterialId, text },
      update: { text },
    });

    return { text: note.text, updated_at: note.updatedAt.toISOString() };
  }

  /**
   * Said plainly rather than left to the foreign key.
   *
   * Without this a note on a lesson that no longer exists fails deep inside Prisma as a
   * constraint violation, which reaches the student as a 500 and tells them nothing.
   */
  private async assertMaterialExists(courseMaterialId: string): Promise<void> {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: courseMaterialId },
      select: { id: true },
    });
    if (!material) {
      throw new NotFoundException('Урок не знайдено');
    }
  }
}
