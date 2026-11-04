import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

export const courseFormFields = (
  values: CreateCourseFormValues,
): Record<string, unknown> => ({
  title: values.title.trim(),
  description: values.description?.trim() ?? '',
  language: values.language,
  tags: values.tags,
  price: Number(values.price.trim()),
  level: values.level,
  /**
   * Sent only when the course really spans a range. The server validates it as a level, so
   * an empty string would be rejected outright rather than read as "no range".
   */
  ...(values.levelTo ? { level_to: values.levelTo } : {}),
  ...(values.durationHours?.trim()
    ? { duration_hours: Number(values.durationHours.trim()) }
    : {}),
  /**
   * Always sent, including zero. Leaving it out would let the server keep whatever it had,
   * and "I set the free preview to none" is exactly the change that must not be dropped.
   */
  trial_module_count: Number(values.trialModuleCount.trim()),
});
