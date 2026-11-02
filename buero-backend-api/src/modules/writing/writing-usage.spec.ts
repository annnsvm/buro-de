import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { WritingUsageService, currentMonth, monthRange } from './writing-usage.service';

/**
 * The monthly spend, added up from what each call actually consumed.
 *
 * The numbers here are the ones the author will read before deciding what the course has to
 * cost, so the two ways a report like this lies are what the tests are about: pricing tokens at
 * one model's rate when another was called, and quietly filling a gap with a guess.
 */
describe('what the writing checks cost over a month', () => {
  /** 1000 in, 500 out, 2000 written to cache, 3000 read from it. */
  const TOKENS = {
    inputTokens: 1000,
    outputTokens: 500,
    cacheWriteTokens: 2000,
    cacheReadTokens: 3000,
  };

  const row = (overrides: Record<string, unknown> = {}) => ({
    userId: 'student-1',
    model: 'claude-opus-5-5',
    ...TOKENS,
    user: { name: 'Olha', email: 'olha@example.com' },
    ...overrides,
  });

  let service: WritingUsageService;
  let findMany: jest.Mock;

  beforeEach(async () => {
    findMany = jest.fn().mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WritingUsageService,
        { provide: PrismaService, useValue: { writingSubmission: { findMany } } },
      ],
    }).compile();
    service = module.get(WritingUsageService);
  });

  /**
   * $4 and $20 per million on Opus, with the cache billed at 1.25x for a write and a tenth for
   * a read: 0.004 + 0.010 + 0.0012 + 0.010.
   */
  it('prices a check from its own tokens', async () => {
    findMany.mockResolvedValue([row()]);

    const report = await service.monthlyReport('2026-11');

    expect(report.total).toMatchObject({
      checks: 1,
      cost: 0.0252,
      unpriced_checks: 0,
      input_tokens: 1000,
      output_tokens: 500,
      cache_write_tokens: 2000,
      cache_read_tokens: 3000,
    });
  });

  /** The same tokens on Sonnet cost half, which is the whole reason the model is stored. */
  it('prices the same tokens by the model that was called', async () => {
    findMany.mockResolvedValue([row({ model: 'claude-sonnet-5-5' })]);

    const report = await service.monthlyReport('2026-11');

    expect(report.total.cost).toBe(0.0126);
    expect(report.by_model).toEqual([
      { model: 'claude-sonnet-5-5', checks: 1, cost: 0.0126 },
    ]);
  });

  /**
   * A row stored before the model was recorded, and a model nobody has a rate for.
   *
   * Pricing these at the current model's rate would put a number in the report that cannot be
   * checked against anything. They are counted, named, and left out of the sum.
   */
  it.each([
    ['a submission from before the model was recorded', null],
    ['a model with no published rate', 'claude-something-new'],
  ])('does not invent a price for %s', async (_name, model) => {
    findMany.mockResolvedValue([row(), row({ model })]);

    const report = await service.monthlyReport('2026-11');

    expect(report.total.checks).toBe(2);
    expect(report.total.unpriced_checks).toBe(1);
    /** Still the one priced row, not two. */
    expect(report.total.cost).toBe(0.0252);
    expect(report.by_model).toEqual(
      expect.arrayContaining([{ model, checks: 1, cost: null }]),
    );
  });

  /** Tokens are still counted for an unpriced row: the usage is known, only the rate is not. */
  it('counts the tokens of a row it cannot price', async () => {
    findMany.mockResolvedValue([row({ model: null })]);

    const report = await service.monthlyReport('2026-11');

    expect(report.total.input_tokens).toBe(1000);
    expect(report.total.cost).toBe(0);
  });

  /**
   * The per-student list exists to find who to talk to, so the heaviest comes first.
   */
  it('lists students by what they spent, heaviest first', async () => {
    findMany.mockResolvedValue([
      row(),
      row({ userId: 'student-2', user: { name: 'Ivan', email: 'ivan@example.com' } }),
      row({ userId: 'student-2', user: { name: 'Ivan', email: 'ivan@example.com' } }),
    ]);

    const report = await service.monthlyReport('2026-11');

    expect(report.by_student).toEqual([
      {
        user_id: 'student-2',
        name: 'Ivan',
        email: 'ivan@example.com',
        checks: 2,
        cost: 0.0504,
      },
      {
        user_id: 'student-1',
        name: 'Olha',
        email: 'olha@example.com',
        checks: 1,
        cost: 0.0252,
      },
    ]);
  });

  it('reports a student who never set a name', async () => {
    findMany.mockResolvedValue([row({ user: { name: null, email: 'a@example.com' } })]);

    const report = await service.monthlyReport('2026-11');

    expect(report.by_student[0]).toMatchObject({ name: null, email: 'a@example.com' });
  });

  /**
   * Half-open, in UTC.
   *
   * A closed interval either drops the last day of the month or counts the first of the next one
   * twice, depending on which end is rounded - and both errors land in the figure the price of
   * the course is set from.
   */
  it('asks for the month as a half-open interval', async () => {
    await service.monthlyReport('2026-11');

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          createdAt: {
            gte: new Date('2026-11-01T00:00:00.000Z'),
            lt: new Date('2026-12-01T00:00:00.000Z'),
          },
        },
      }),
    );
  });

  it('rolls the year over in December', () => {
    expect(monthRange('2026-12')).toEqual({
      from: new Date('2026-12-01T00:00:00.000Z'),
      to: new Date('2027-01-01T00:00:00.000Z'),
    });
  });

  it.each(['2026-13', '2026-00', 'листопад', '2026', '26-11', ''])(
    'refuses %s as a month',
    (month) => {
      expect(() => monthRange(month)).toThrow(/YYYY-MM|від 01 до 12/);
    },
  );

  it('reports the current month when none is asked for', async () => {
    const report = await service.monthlyReport();

    expect(report.month).toBe(currentMonth());
  });

  it('reports an empty month as zero rather than as nothing', async () => {
    const report = await service.monthlyReport('2026-01');

    expect(report.total).toMatchObject({ checks: 0, cost: 0, unpriced_checks: 0 });
    expect(report.by_student).toEqual([]);
    expect(report.by_model).toEqual([]);
  });
});
