import type { CourseLevel } from '@/types/features/courseManagment/CourseLevel.types';
import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';

export const COURSE_LEVEL_OPTIONS: Array<{ value: CourseLevel; label: string }> = [
  { value: '', label: 'Виберіть рівень' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
];

export const CURRENCY_OPTIONS: Array<{ value: CurrencySymbol; label: string }> = [
  { value: '€', label: '€' },
  { value: '$', label: '$' },
  { value: '£', label: '£' },
];

