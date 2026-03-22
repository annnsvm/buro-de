import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

/**
 * Спільні поля тіла PATCH/POST для курсу в редакторі (create та update відрізняються лише `is_published` на create).
 */
export const getCourseEditorFormApiFields = (
  values: CreateCourseFormValues,
): Record<string, unknown> => ({
  title: values.title.trim(),
  description: values.description?.trim() ?? '',
  language: values.language,
  category: values.category,
  tags: values.tags,
  price: Number(values.price.trim()),
  level: values.level,
  ...(values.durationHours?.trim()
    ? { duration_hours: Number(values.durationHours.trim()) }
    : {}),
});

export const buildCourseCreatePayload = (
  values: CreateCourseFormValues,
): Record<string, unknown> => ({
  ...getCourseEditorFormApiFields(values),
  is_published: false,
});

export const buildCourseUpdatePayload = (
  values: CreateCourseFormValues,
): Record<string, unknown> => getCourseEditorFormApiFields(values);
