import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from '../../generated/prisma/client';
import {
  CourseMaterialType,
  PracticeBlock,
  QuestionType,
} from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { shortLabel } from './short-label';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { validateQuestion } from './exercise-registry';
import type {
  SavePracticeElementDto,
  SaveQuestionDto,
  ReorderQuestionsDto,
} from './question-editor.dto';

/**
 * Editing a quiz's questions on the platform.
 *
 * Questions used to be edited as JSON inside the material and mirrored into the table
 * on every save. That made the material the source of truth and the table a copy,
 * which went wrong the moment a quiz was filled by import: the material's JSON was
 * empty, so renaming the quiz rebuilt its questions from nothing and deleted them.
 * The table is now the only place questions live, and this is how they are changed.
 */
@Injectable()
export class QuestionEditorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async list(courseId: string, moduleId: string, materialId: string) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const questions = await this.prisma.question.findMany({
      where: { materialId },
      orderBy: { orderIndex: 'asc' },
    });
    return questions.map((question) => this.toResponse(question));
  }

  async save(
    courseId: string,
    moduleId: string,
    materialId: string,
    questionId: string | null,
    dto: SaveQuestionDto,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);

    const payload = this.buildPayload(dto);
    const acceptedAnswers = dto.accepted_answers
      .map((answer) => answer.trim())
      .filter(Boolean);

    /**
     * Refuse a question a student could not answer - no options to choose from, an
     * answer key pointing at an option that no longer exists, nothing marked correct.
     * Letting it through means a dead end discovered mid-lesson.
     */
    const problems = validateQuestion({
      id: questionId ?? 'new',
      type: dto.type,
      payload,
      acceptedAnswers,
    });
    if (problems.length > 0) {
      throw new BadRequestException(problems.join('; '));
    }

    /**
     * A question may only point at a text of this same material and block - otherwise a
     * student would be asked about a text the block never shows them.
     */
    const block = dto.block ?? PracticeBlock.grammatik;
    const elementId = await this.resolveElementId(materialId, block, dto.element_id);

    const data = {
      materialId,
      type: dto.type,
      prompt: dto.prompt.trim(),
      payload: payload as Prisma.InputJsonObject,
      acceptedAnswers,
      explanation: dto.explanation?.trim() || null,
      points: dto.points ?? 1,
      skills: dto.skills ?? [],
      block,
      elementId,
    };

    if (questionId) {
      const existing = await this.prisma.question.findFirst({
        where: { id: questionId, materialId },
      });
      if (!existing) {
        throw new NotFoundException('Питання не знайдено в цьому квізі');
      }
      const updated = await this.prisma.question.update({
        where: { id: questionId },
        data,
      });
      return this.toResponse(updated);
    }

    const last = await this.prisma.question.aggregate({
      where: { materialId },
      _max: { orderIndex: true },
    });
    const created = await this.prisma.question.create({
      data: {
        id: randomUUID(),
        ...data,
        orderIndex: (last._max.orderIndex ?? -1) + 1,
      },
    });
    return this.toResponse(created);
  }

  async remove(
    courseId: string,
    moduleId: string,
    materialId: string,
    questionId: string,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const existing = await this.prisma.question.findFirst({
      where: { id: questionId, materialId },
    });
    if (!existing) {
      throw new NotFoundException('Питання не знайдено в цьому квізі');
    }
    await this.prisma.question.delete({ where: { id: questionId } });
    return { deleted: true, id: questionId };
  }

  async reorder(
    courseId: string,
    moduleId: string,
    materialId: string,
    dto: ReorderQuestionsDto,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);

    const owned = await this.prisma.question.findMany({
      where: { materialId },
      select: { id: true },
    });
    const ownedIds = new Set(owned.map((question) => question.id));
    const foreign = dto.ids.filter((id) => !ownedIds.has(id));
    if (foreign.length > 0) {
      throw new BadRequestException(
        `Питання не належать цьому квізу: ${foreign.join(', ')}`,
      );
    }

    await this.prisma.$transaction(
      dto.ids.map((id, index) =>
        this.prisma.question.update({
          where: { id },
          data: { orderIndex: index },
        }),
      ),
    );
    return this.list(courseId, moduleId, materialId);
  }

  /** The texts and recordings of a material, or of one of its blocks. */
  async listElements(
    courseId: string,
    moduleId: string,
    materialId: string,
    block?: PracticeBlock,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const elements = await this.prisma.practiceElement.findMany({
      where: { materialId, ...(block ? { block } : {}) },
      orderBy: [{ block: 'asc' }, { orderIndex: 'asc' }],
      /**
       * How many questions point at each text. A text nobody's question points at is never
       * shown to a student, and that is invisible from the outside - the count is how the
       * author finds out while they are still on the page.
       */
      include: { _count: { select: { questions: true } } },
    });
    return elements.map((element) => this.toElementResponse(element));
  }

  async saveElement(
    courseId: string,
    moduleId: string,
    materialId: string,
    elementId: string | null,
    dto: SavePracticeElementDto,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);

    const body = dto.body?.trim() || null;
    const data = {
      block: dto.block,
      kind: dto.kind,
      /**
       * The short name, or the first sentence of the task when none was given.
       *
       * The two used to be one field, with the task's own 300-character name limit applied to
       * it - so a real prompt was refused for being too long and there was nowhere else to put
       * it. They are separate now, and the name is the part that can be left alone.
       */
      title: dto.title?.trim() || shortLabel(body ?? '') || 'Без назви',
      body,
      transcript: dto.transcript?.trim() || null,
      sampleAnswer: dto.sample_answer?.trim() || null,
      hints: dto.hints?.trim() || null,
      /**
       * The rubric a letter is marked against. Blank lines are dropped rather than saved as
       * empty criteria, because an empty criterion would be shown to the student as a rule and
       * sent to the grader as a nothing.
       */
      criteria: (dto.criteria ?? [])
        .map((criterion) => criterion.trim())
        .filter(Boolean),
      minSentences: dto.min_sentences ?? null,
      maxSentences: dto.max_sentences ?? null,
    };

    if (elementId) {
      const existing = await this.prisma.practiceElement.findFirst({
        where: { id: elementId, materialId },
      });
      if (!existing) {
        throw new NotFoundException('Матеріал для читання не знайдено');
      }
      const updated = await this.prisma.practiceElement.update({
        where: { id: elementId },
        data,
      });
      return this.toElementResponse(updated);
    }

    const last = await this.prisma.practiceElement.aggregate({
      where: { materialId, block: dto.block },
      _max: { orderIndex: true },
    });
    const created = await this.prisma.practiceElement.create({
      data: {
        id: randomUUID(),
        materialId,
        ...data,
        orderIndex: (last._max.orderIndex ?? -1) + 1,
      },
    });
    return this.toElementResponse(created);
  }

  /**
   * Puts a recording behind a listening element.
   *
   * The file goes to Cloudinary rather than into the database, the same way a lesson's
   * attachments already do - and the element keeps only the address. Replacing a recording
   * overwrites the address and leaves the old file in storage: an audio that questions still
   * point at is not something to delete on a save that might have been a mistake.
   */
  async attachAudio(
    courseId: string,
    moduleId: string,
    materialId: string,
    elementId: string,
    file?: Express.Multer.File,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    if (!file) {
      throw new BadRequestException('Файл не надіслано');
    }
    const element = await this.prisma.practiceElement.findFirst({
      where: { id: elementId, materialId },
    });
    if (!element) {
      throw new NotFoundException('Матеріал для аудіювання не знайдено');
    }

    const uploaded = await this.cloudinary.uploadFile(file.buffer, {
      folder: `practice/${materialId}`,
      publicId: randomUUID(),
    });

    const updated = await this.prisma.practiceElement.update({
      where: { id: elementId },
      data: { audioUrl: uploaded.url },
    });
    return this.toElementResponse(updated);
  }

  /**
   * Matches a pile of uploaded recordings to the elements that asked for them, by file name.
   *
   * A module is sixteen recordings, and attaching them one at a time means sixteen trips through
   * the same dialog with a chance to put each in the wrong place. The CSV already said which
   * file each element wants; this is simply the other half of that promise being kept.
   *
   * A file nobody asked for is reported rather than dropped silently - most often it is a
   * typo in one of the two names, and the author can only see that if it is said out loud.
   */
  async attachAudioBatch(
    courseId: string,
    moduleId: string,
    materialId: string,
    files: Express.Multer.File[],
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    if (!files?.length) {
      throw new BadRequestException('Файли не надіслано');
    }

    const elements = await this.prisma.practiceElement.findMany({
      where: { materialId, audioFileName: { not: null } },
    });
    const wanted = new Map(
      elements.map((element) => [
        (element.audioFileName ?? '').trim().toLowerCase(),
        element,
      ]),
    );

    const matched: string[] = [];
    const unmatched: string[] = [];

    for (const file of files) {
      const name = (file.originalname ?? '').trim().toLowerCase();
      const element = wanted.get(name);
      if (!element) {
        unmatched.push(file.originalname ?? '(без імені)');
        continue;
      }

      const uploaded = await this.cloudinary.uploadFile(file.buffer, {
        folder: `practice/${materialId}`,
        publicId: randomUUID(),
      });
      await this.prisma.practiceElement.update({
        where: { id: element.id },
        data: { audioUrl: uploaded.url },
      });
      matched.push(element.audioFileName ?? '');
    }

    /** Which recordings are still owed, so the author sees the gap rather than counting rows. */
    const stillMissing = elements
      .filter(
        (element) =>
          !element.audioUrl &&
          !matched.includes(element.audioFileName ?? ''),
      )
      .map((element) => element.audioFileName ?? '');

    return {
      uploaded: matched.length,
      matched,
      unmatched,
      still_missing: stillMissing,
    };
  }

  /**
   * Deleting a text leaves its questions in place, unbound.
   *
   * The alternative - taking the questions down with it - turns a mistyped title into lost
   * work. The database's own rule already does this (`onDelete: SetNull`); this only says so
   * out loud, and reports how many questions were freed so it is not a silent change.
   */
  async removeElement(
    courseId: string,
    moduleId: string,
    materialId: string,
    elementId: string,
  ) {
    await this.assertQuizMaterial(courseId, moduleId, materialId);
    const existing = await this.prisma.practiceElement.findFirst({
      where: { id: elementId, materialId },
    });
    if (!existing) {
      throw new NotFoundException('Матеріал для читання не знайдено');
    }
    const orphaned = await this.prisma.question.count({ where: { elementId } });
    await this.prisma.practiceElement.delete({ where: { id: elementId } });
    return { deleted: true, id: elementId, unbound_questions: orphaned };
  }

  /**
   * Accepts a text only if it belongs to this material and this block.
   *
   * Silently dropping a wrong id would leave the teacher believing the question was bound;
   * refusing says which of the two went wrong while it can still be corrected.
   */
  private async resolveElementId(
    materialId: string,
    block: PracticeBlock,
    elementId?: string,
  ): Promise<string | null> {
    if (!elementId) return null;
    const element = await this.prisma.practiceElement.findFirst({
      where: { id: elementId, materialId, block },
      select: { id: true },
    });
    if (!element) {
      throw new BadRequestException(
        'Текст не знайдено в цьому блоці практики',
      );
    }
    return element.id;
  }

  private toElementResponse(element: {
    id: string;
    block: PracticeBlock;
    kind: string;
    title: string;
    body: string | null;
    audioUrl: string | null;
    audioFileName: string | null;
    transcript: string | null;
    sampleAnswer: string | null;
    hints: string | null;
    criteria?: string[];
    minSentences?: number | null;
    maxSentences?: number | null;
    orderIndex: number;
    _count?: { questions: number };
  }) {
    return {
      id: element.id,
      block: element.block,
      kind: element.kind,
      title: element.title,
      body: element.body,
      audio_url: element.audioUrl,
      /** What the import was promised, so a missing recording can be named rather than guessed. */
      audio_file_name: element.audioFileName,
      transcript: element.transcript,
      sample_answer: element.sampleAnswer,
      hints: element.hints,
      /** The rubric, so the editor shows what the import read out of the file. */
      criteria: element.criteria ?? [],
      min_sentences: element.minSentences ?? null,
      max_sentences: element.maxSentences ?? null,
      order_index: element.orderIndex,
      question_count: element._count?.questions ?? 0,
    };
  }

  /** Shapes only what the chosen type needs, so stale fields cannot linger. */
  private buildPayload(dto: SaveQuestionDto): Record<string, unknown> {
    if (
      dto.type === QuestionType.single_choice ||
      dto.type === QuestionType.multi_choice
    ) {
      return {
        options: (dto.options ?? []).map((option) => ({
          id: option.id?.trim() || randomUUID(),
          text: option.text,
        })),
      };
    }
    if (dto.type === QuestionType.ordering) {
      return { tokens: (dto.tokens ?? []).map((token) => token.trim()).filter(Boolean) };
    }
    return {};
  }

  private async assertQuizMaterial(
    courseId: string,
    moduleId: string,
    materialId: string,
  ) {
    const material = await this.prisma.courseMaterial.findFirst({
      where: { id: materialId, moduleId, module: { courseId } },
    });
    if (!material) {
      throw new NotFoundException(
        'Матеріал не знайдено або не належить цьому модулю',
      );
    }
    /** A practice holds questions in the same way a quiz does, so both are editable here. */
    if (
      material.type !== CourseMaterialType.quiz &&
      material.type !== CourseMaterialType.practice
    ) {
      throw new BadRequestException('Матеріал не містить питань');
    }
    return material;
  }

  private toResponse(question: {
    id: string;
    type: QuestionType;
    prompt: string;
    payload: unknown;
    acceptedAnswers: string[];
    explanation: string | null;
    points: number;
    skills: string[];
    orderIndex: number;
    block: PracticeBlock;
    elementId: string | null;
  }) {
    const payload = (question.payload ?? {}) as {
      options?: Array<{ id: string; text: string }>;
      tokens?: string[];
    };
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      /** The teacher edits the answer key, so unlike the player they do see it. */
      accepted_answers: question.acceptedAnswers,
      explanation: question.explanation,
      points: question.points,
      skills: question.skills,
      order_index: question.orderIndex,
      block: question.block,
      element_id: question.elementId,
      options: payload.options ?? [],
      tokens: payload.tokens ?? [],
    };
  }
}
