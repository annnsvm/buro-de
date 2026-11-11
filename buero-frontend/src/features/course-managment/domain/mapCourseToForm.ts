import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import type { ApiCourseTreeResponse } from '@/types/features/courseManagment';

const isLanguage = (v: string): v is CreateCourseFormValues['language'] =>
  v === 'en' || v === 'de';

const isCategory = (v: string): v is CreateCourseFormValues['category'] =>
  v === 'language' || v === 'sociocultural';

const isLevel = (v: string): v is Exclude<CreateCourseFormValues['level'], ''> =>
  v === 'A1' || v === 'A2' || v === 'B1' || v === 'B2' || v === 'C1';

export const mapCourseToForm = (data: ApiCourseTreeResponse): CreateCourseFormValues => {
  const langRaw = String(data.language ?? 'en');
  const catRaw = String(data.category ?? 'language');
  const levelRaw = data.level != null ? String(data.level) : '';
  const levelToRaw = data.levelTo != null ? String(data.levelTo) : '';

  const durationRaw = data.durationHours ?? data.duration_hours;
  const trialRaw = data.trialModuleCount ?? data.trial_module_count;
  const priceNum = data.price;

  return {
    title: String(data.title ?? ''),
    description: data.description != null ? String(data.description) : '',
    language: isLanguage(langRaw) ? langRaw : 'en',
    category: isCategory(catRaw) ? catRaw : 'language',
    price:
      priceNum != null && Number.isFinite(Number(priceNum))
        ? String(priceNum)
        : '',
    durationHours:
      durationRaw != null && Number.isFinite(Number(durationRaw))
        ? String(durationRaw)
        : '',
    level: isLevel(levelRaw) ? levelRaw : '',
    levelTo: isLevel(levelToRaw) ? levelToRaw : '',
    /**
     * Two when the server said nothing, which is the column's own default - so an older
     * response cannot make the form read as "no free modules".
     */
    trialModuleCount:
      trialRaw != null && Number.isFinite(Number(trialRaw)) ? String(trialRaw) : '2',
    /** False when the server said nothing, which is the column's own default. */
    isIntegration: data.isIntegration === true,
  };
};
