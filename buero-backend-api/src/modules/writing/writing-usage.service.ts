import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { costOf, roundCost } from './pricing';

/**
 * What the writing checks cost over a month, in total and per student.
 *
 * Point 6 of the author's amendment: "звіт для адміністратора - скільки витрачено за місяць,
 * загалом і по кожному студенту". Every call has recorded its own tokens and its own model since
 * the usage migration, so this adds up what happened rather than estimating from an average -
 * an average would hide exactly the thing the report is for, a student who sent forty texts.
 *
 * Rows whose model carries no rate - every submission stored before the model was recorded, and
 * any model added to the account but not to the price table - are counted apart instead of being
 * priced at a guess. A total nobody can check is worse than a total with a gap named in it.
 */

export type UsageTotals = {
  checks: number;
  /** Dollars, for the rows that could be priced. */
  cost: number;
  /** Rows left out of `cost` because their model has no known rate. */
  unpriced_checks: number;
  input_tokens: number;
  output_tokens: number;
  cache_write_tokens: number;
  cache_read_tokens: number;
};

export type UsageReport = {
  /** The month reported, as asked for: `YYYY-MM`. */
  month: string;
  from: string;
  to: string;
  total: UsageTotals;
  by_model: Array<{ model: string | null; checks: number; cost: number | null }>;
  /** Heaviest first: the point of the per-student list is to find who to talk to. */
  by_student: Array<{
    user_id: string;
    /** Null for a student who never set one; the email is what identifies them anyway. */
    name: string | null;
    email: string;
    checks: number;
    cost: number;
  }>;
};

const MONTH = /^(\d{4})-(\d{2})$/;

/**
 * The month as a half-open interval in UTC.
 *
 * Half-open because a closed one either drops the last day's checks or counts the first of the
 * next month twice, depending on which end is rounded.
 */
export const monthRange = (month: string): { from: Date; to: Date } => {
  const parsed = MONTH.exec(month);
  if (!parsed) {
    throw new BadRequestException('Місяць має бути у форматі YYYY-MM');
  }
  const year = Number(parsed[1]);
  const index = Number(parsed[2]) - 1;
  if (index < 0 || index > 11) {
    throw new BadRequestException('Місяць має бути від 01 до 12');
  }
  return {
    from: new Date(Date.UTC(year, index, 1)),
    to: new Date(Date.UTC(year, index + 1, 1)),
  };
};

export const currentMonth = (now: Date = new Date()): string =>
  `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

@Injectable()
export class WritingUsageService {
  constructor(private readonly prisma: PrismaService) {}

  async monthlyReport(month: string = currentMonth()): Promise<UsageReport> {
    const { from, to } = monthRange(month);

    /**
     * Read row by row rather than grouped in the database, because the cost of a row depends on
     * its model and the arithmetic differs per token class. A month of checks is hundreds of
     * rows, not millions.
     */
    const rows = await this.prisma.writingSubmission.findMany({
      where: { createdAt: { gte: from, lt: to } },
      select: {
        userId: true,
        model: true,
        inputTokens: true,
        outputTokens: true,
        cacheWriteTokens: true,
        cacheReadTokens: true,
        user: { select: { name: true, email: true } },
      },
    });

    const total: UsageTotals = {
      checks: 0,
      cost: 0,
      unpriced_checks: 0,
      input_tokens: 0,
      output_tokens: 0,
      cache_write_tokens: 0,
      cache_read_tokens: 0,
    };
    const byModel = new Map<string | null, { checks: number; cost: number | null }>();
    const byStudent = new Map<
      string,
      { name: string | null; email: string; checks: number; cost: number }
    >();

    for (const row of rows) {
      const tokens = {
        inputTokens: row.inputTokens,
        outputTokens: row.outputTokens,
        cacheWriteTokens: row.cacheWriteTokens,
        cacheReadTokens: row.cacheReadTokens,
      };
      const cost = costOf(row.model, tokens);

      total.checks += 1;
      total.input_tokens += row.inputTokens;
      total.output_tokens += row.outputTokens;
      total.cache_write_tokens += row.cacheWriteTokens;
      total.cache_read_tokens += row.cacheReadTokens;
      if (cost === null) total.unpriced_checks += 1;
      else total.cost += cost;

      const model = byModel.get(row.model) ?? { checks: 0, cost: cost === null ? null : 0 };
      model.checks += 1;
      if (cost !== null) model.cost = (model.cost ?? 0) + cost;
      byModel.set(row.model, model);

      const student = byStudent.get(row.userId) ?? {
        name: row.user.name,
        email: row.user.email,
        checks: 0,
        cost: 0,
      };
      student.checks += 1;
      student.cost += cost ?? 0;
      byStudent.set(row.userId, student);
    }

    return {
      month,
      from: from.toISOString(),
      to: to.toISOString(),
      total: { ...total, cost: roundCost(total.cost) },
      by_model: [...byModel.entries()]
        .map(([model, value]) => ({
          model,
          checks: value.checks,
          cost: value.cost === null ? null : roundCost(value.cost),
        }))
        .sort((a, b) => b.checks - a.checks),
      by_student: [...byStudent.entries()]
        .map(([user_id, value]) => ({
          user_id,
          name: value.name,
          email: value.email,
          checks: value.checks,
          cost: roundCost(value.cost),
        }))
        .sort((a, b) => b.cost - a.cost || b.checks - a.checks),
    };
  }
}
