import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PracticeElementKind, Role } from 'src/generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CourseMaterialService } from '../course-materials/course-material.service';

/**
 * The speaking block: a prompt, the student's own recording, and the author's answer to
 * compare it against.
 *
 * Nothing here is graded, and that is deliberate rather than unfinished. Marking spoken German
 * automatically would be a judgement the platform cannot make honestly, so the student makes
 * it: they record, listen to themselves, then read what a full answer sounds like. What is
 * stored is only that the task was answered - which is what the module test needs, and what
 * lets someone hear their attempt from a week ago.
 */
@Injectable()
export class SpeakingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseMaterialService: CourseMaterialService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  /**
   * The tasks of a practice's speaking block, with whatever this student has already recorded.
   *
   * The model answer and the prompts are held back until there is a recording. Reading a good
   * answer before speaking turns the task into a copying exercise, and the one thing it is for
   * - finding the words yourself - is exactly what gets skipped.
   */
  async getTasks(materialId: string, userId: string, role: Role) {
    await this.assertCanOpen(materialId, userId, role);

    const elements = await this.prisma.practiceElement.findMany({
      where: { materialId, kind: PracticeElementKind.rec },
      orderBy: { orderIndex: 'asc' },
    });
    const recordings = elements.length
      ? await this.prisma.speakingRecording.findMany({
          where: { userId, practiceElementId: { in: elements.map((e) => e.id) } },
        })
      : [];
    const byElement = new Map(recordings.map((row) => [row.practiceElementId, row]));

    return {
      tasks: elements.map((element) => {
        const mine = byElement.get(element.id);
        return {
          element_id: element.id,
          /** The long form when the author wrote one; the name is the whole task otherwise. */
          task: element.body?.trim() ? element.body : element.title,
          /** Opened by recording, not by asking - see above. */
          answer_open: Boolean(mine),
          sample_answer: mine ? element.sampleAnswer : null,
          hints: mine ? splitHints(element.hints) : [],
          recording: mine
            ? {
                audio_url: mine.audioUrl,
                duration_seconds: mine.durationSeconds,
                recorded_at: mine.createdAt.toISOString(),
              }
            : null,
        };
      }),
    };
  }

  /**
   * Keeps a recording, replacing the one before it.
   *
   * Re-recording is the normal way to use this - a student says it three times before they are
   * happy - so a second attempt replaces the first rather than piling up. The old file is left
   * in storage: losing a recording to a save that might have been a misclick would be worse
   * than keeping a file nobody reads.
   */
  async saveRecording(
    elementId: string,
    userId: string,
    role: Role,
    file: Express.Multer.File | undefined,
    durationSeconds?: number,
  ) {
    if (!file) {
      throw new BadRequestException('Запис не надіслано');
    }
    const element = await this.prisma.practiceElement.findUnique({
      where: { id: elementId },
    });
    if (!element || element.kind !== PracticeElementKind.rec) {
      throw new NotFoundException(`Завдання з id ${elementId} не знайдено`);
    }
    await this.assertCanOpen(element.materialId, userId, role);

    /**
     * An empty recording is the one failure worth refusing outright: it would pass the test's
     * "something was recorded" check while being nothing at all.
     */
    if (file.size < 1024) {
      throw new BadRequestException(
        'Запис порожній або надто короткий - спробуйте ще раз',
      );
    }

    const uploaded = await this.cloudinary.uploadFile(file.buffer, {
      folder: `speaking/${element.materialId}`,
      publicId: randomUUID(),
    });

    const saved = await this.prisma.speakingRecording.upsert({
      where: { userId_practiceElementId: { userId, practiceElementId: elementId } },
      create: {
        userId,
        practiceElementId: elementId,
        audioUrl: uploaded.url,
        durationSeconds: durationSeconds ?? null,
      },
      update: {
        audioUrl: uploaded.url,
        durationSeconds: durationSeconds ?? null,
      },
    });

    return {
      element_id: elementId,
      /** Earned by recording: the student can now see what a full answer sounds like. */
      answer_open: true,
      sample_answer: element.sampleAnswer,
      hints: splitHints(element.hints),
      recording: {
        audio_url: saved.audioUrl,
        duration_seconds: saved.durationSeconds,
        recorded_at: saved.createdAt.toISOString(),
      },
    };
  }

  private async assertCanOpen(materialId: string, userId: string, role: Role) {
    const material = await this.prisma.courseMaterial.findUnique({
      where: { id: materialId },
      include: { module: true },
    });
    if (!material) {
      throw new NotFoundException(`Матеріал з id ${materialId} не знайдено`);
    }
    if (material.module?.courseId) {
      await this.courseMaterialService.assertCanAccessModule(
        userId,
        role,
        material.module.courseId,
        material.moduleId,
      );
    }
    return material;
  }
}

/**
 * The words to lean on, as the author wrote them.
 *
 * One per line is how a person writes a list, and the module 2 file also separates them with
 * a slash on a single line. Both are read, because refusing the second would reject rows that
 * are already written.
 */
export const splitHints = (hints: string | null): string[] =>
  (hints ?? '')
    .split(/\r?\n|\s+\/\s+/)
    .map((hint) => hint.replace(/^\s*(?:\d+[.)]|[-–—•])\s*/, '').trim())
    .filter(Boolean);
