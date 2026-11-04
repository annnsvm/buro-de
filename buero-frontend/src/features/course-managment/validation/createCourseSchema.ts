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

  tags: z.array(
    z.string().trim().min(1, { message: 'Тег не може бути порожнім' }),
  ),

  level: z.union([levelSchema, z.literal('')]),
  /**
   * Only a course spanning several levels needs a top of the range, so an absent value is
   * the ordinary case and reads as empty rather than as missing.
   */
  levelTo: z.union([levelSchema, z.literal('')]),
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

  if (values.tags.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['tags'],
      message: 'Додайте хоча б один тег',
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
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;

