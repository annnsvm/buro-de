import { z } from 'zod';

const languageSchema = z.enum(['en', 'de'], {
  message: 'Мова курсу: en або de',
});

const categorySchema = z.enum(['language', 'sociocultural'], {
  message: 'Категорія: language або sociocultural',
});

const levelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1'], {
  message: 'Рівень: A1, A2, B1 або B2',
});

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Вкажіть назву курсу' })
    .max(500, { message: 'Назва курсу - не довша за 500 символів' }),

  description: z
    .string()
    .trim()
    .max(5000, { message: 'Опис курсу завеликий' })
    .optional()
    .or(z.literal('')),

  language: languageSchema,

  category: categorySchema,

  price: z.string().trim(),
  durationHours: z.string().trim().optional().or(z.literal('')),

  level: z.union([levelSchema, z.literal('')]),
  /**
   * Only a course spanning several levels needs a top of the range, so an absent value is
   * the ordinary case and reads as empty rather than as missing.
   */
  levelTo: z.union([levelSchema, z.literal('')]),

  /**
   * Which half of the catalogue this course belongs to.
   *
   * A plain boolean, and now the only grouping a course carries. It used to be one of the
   * tags, which was both undiscoverable - `Integration` was not among the tags the editor
   * offered - and case-sensitive on the server but not on the page. The tags themselves are
   * gone: nothing ever showed them to a student, and this was the only work they did.
   */
  isIntegration: z.boolean(),

  /**
   * How many modules a trial opens. Required, unlike the duration: a cleared field would
   * look like "nothing is free" while silently leaving the old number in place.
   */
  trialModuleCount: z.string().trim(),
}).superRefine((values, ctx) => {
  if (!values.price.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['price'],
      message: 'Вкажіть ціну',
    });
    return;
  }

  const n = Number(values.price.trim());
  if (Number.isNaN(n) || n < 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['price'],
      message: 'Ціна не може бути відʼємною',
    });
  }

  if (values.level === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['level'],
      message: 'Виберіть рівень',
    });
  }

  if (values.durationHours && values.durationHours.trim()) {
    const duration = Number(values.durationHours.trim());
    if (!Number.isInteger(duration) || duration < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['durationHours'],
        message: 'Тривалість - ціле невідʼємне число',
      });
    }
  }

  const trial = Number(values.trialModuleCount.trim());
  if (
    !values.trialModuleCount.trim() ||
    !Number.isInteger(trial) ||
    trial < 0 ||
    trial > 99
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['trialModuleCount'],
      message: 'Ціле число від 0 до 99',
    });
  }
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

