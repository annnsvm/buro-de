import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { QuestionType } from '../../generated/prisma/enums';
import { PrismaService } from '../../prisma/prisma.service';

type AuthoredOption = { id?: unknown; text?: unknown };

/** Options as they are stored: anything unrecognised is dropped rather than kept raw. */
type StoredOption = { id: string; text: string };

type AuthoredQuestion = {
  id?: unknown;
  type?: unknown;
  text?: unknown;
  prompt?: unknown;
  correct?: unknown;
  acceptedAnswers?: unknown;
  options?: unknown;
  tokens?: unknown;
  explanation?: unknown;
  points?: unknown;
  skills?: unknown;
};

export type SyncedQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  payload: { options?: StoredOption[]; tokens?: string[] };
  acceptedAnswers: string[];
  explanation: string | null;
  points: number;
  skills: string[];
  orderIndex: number;
};

const asString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null;

const asStringList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

/** Reads both shapes the grader has always accepted. */
export const readAuthoredQuestions = (content: unknown): AuthoredQuestion[] => {
  if (!content || typeof content !== 'object') return [];
  const flat = (content as { questions?: unknown }).questions;
  if (Array.isArray(flat)) return flat as AuthoredQuestion[];

  const blocks = (content as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return [];
  return blocks.flatMap((block) => {
    const questions = (block as { questions?: unknown })?.questions;
    return Array.isArray(questions) ? (questions as AuthoredQuestion[]) : [];
  });
};

/**
 * Turns one authored question into a row.
 *
 * `type` is honoured when the author states it, which is how written and ordering
 * exercises will arrive once the editor can produce them. Older content says nothing,
 * so the shape decides: a list of correct ids means several options, a single value
 * means one.
 */
const toSyncedQuestion = (
  raw: AuthoredQuestion,
  orderIndex: number,
): SyncedQuestion => {
  const declaredType = asString(raw.type);
  const options: StoredOption[] = (
    Array.isArray(raw.options) ? (raw.options as AuthoredOption[]) : []
  )
    .map((option) => ({
      id: asString(option?.id) ?? '',
      text: typeof option?.text === 'string' ? option.text : '',
    }))
    .filter((option) => option.id !== '');
  const tokens = asStringList(raw.tokens);

  const type =
    declaredType && declaredType in QuestionType
      ? QuestionType[declaredType as keyof typeof QuestionType]
      : Array.isArray(raw.correct)
        ? QuestionType.multi_choice
        : QuestionType.single_choice;

  const accepted = asStringList(raw.acceptedAnswers);
  const acceptedAnswers =
    accepted.length > 0
      ? accepted
      : Array.isArray(raw.correct)
        ? [
            // One entry holding the whole set, matching how the grader compares it.
            raw.correct
              .map((item) => String(item).trim())
              .filter(Boolean)
              .sort()
              .join(','),
          ]
        : asString(raw.correct)
          ? [String(raw.correct)]
          : [];

  const points = Number(raw.points);

  return {
    id: asString(raw.id) ?? randomUUID(),
    type,
    prompt: asString(raw.prompt) ?? asString(raw.text) ?? '',
    payload: {
      ...(options.length > 0 && { options }),
      ...(tokens.length > 0 && { tokens }),
    },
    acceptedAnswers: acceptedAnswers.filter((answer) => answer.length > 0),
    explanation: asString(raw.explanation),
    points: Number.isFinite(points) && points > 0 ? Math.trunc(points) : 1,
    skills: asStringList(raw.skills),
    orderIndex,
  };
};

/**
 * Keeps the questions table in step with the JSON a teacher edits.
 *
 * Grading reads the table while the course editor still writes JSON, so without this
 * the two would drift the first time a quiz was edited and students would be marked
 * against the questions they were no longer shown.
 */
@Injectable()
export class QuestionSyncService {
  private readonly logger = new Logger(QuestionSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async syncMaterial(materialId: string, content: unknown): Promise<number> {
    const questions = readAuthoredQuestions(content).map(toSyncedQuestion);
    const keptIds = questions.map((question) => question.id);

    await this.prisma.$transaction(async (tx) => {
      await tx.question.deleteMany({
        where: {
          materialId,
          ...(keptIds.length > 0 && { id: { notIn: keptIds } }),
        },
      });

      for (const question of questions) {
        const data = {
          materialId,
          type: question.type,
          prompt: question.prompt,
          payload: question.payload as Prisma.InputJsonObject,
          acceptedAnswers: question.acceptedAnswers,
          explanation: question.explanation,
          points: question.points,
          skills: question.skills,
          orderIndex: question.orderIndex,
        };
        await tx.question.upsert({
          where: { id: question.id },
          create: { id: question.id, ...data },
          update: data,
        });
      }
    });

    this.logger.log(
      `Synced ${questions.length} question(s) for material ${materialId}`,
    );
    return questions.length;
  }
}
