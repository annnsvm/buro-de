import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

export const courseFormFields = (
  values: CreateCourseFormValues,
): Record<string, unknown> => ({
  title: values.title.trim(),
  description: values.description?.trim() ?? '',
  language: values.language,
  price: Number(values.price.trim()),
  level: values.level,
  /**
   * Sent only when the course really spans a range. The server validates it as a level, so
   * an empty string would be rejected outright rather than read as "no range".
   */
  ...(values.levelTo ? { level_to: values.levelTo } : {}),
  /**
   * Always sent, like the other decisions on this form: "go back to working it out" has to
   * be sendable, not merely omittable.
   */
  duration_hours_manual: values.durationHoursManual,
  /**
   * The hours themselves only when the author owns them. On automatic the figure belongs
   * to the running sum, and sending a stale copy of it from the form would fight that.
   */
  ...(values.durationHoursManual && values.durationHours?.trim()
    ? { duration_hours: Number(values.durationHours.trim()) }
    : {}),
  /**
   * Always sent, including zero. Leaving it out would let the server keep whatever it had,
   * and "I set the free preview to none" is exactly the change that must not be dropped.
   */
  trial_module_count: Number(values.trialModuleCount.trim()),
  /**
   * Always sent, including false. It decides which half of the catalogue the course shows
   * in, so "this is not an integration course" has to be sendable, not just omittable.
   */
  is_integration: values.isIntegration,
});
