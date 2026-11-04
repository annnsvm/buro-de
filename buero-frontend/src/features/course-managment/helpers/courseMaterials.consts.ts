import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

/**
 * What a teacher can make, in the words she uses for it.
 *
 * Three kinds, because that is what the course is built from now: a lesson to watch, the
 * practice under it, and the test that closes the module. The two that are gone were real
 * once and are not any more - a standalone writing task, which now lives inside a practice
 * as its Schreiben block, and a lesson quiz, whose job the practice does.
 *
 * Only creation is affected. Quizzes already in a course keep working and stay editable:
 * the list says what to make next, not what is allowed to exist.
 */
export const MATERIAL_TYPE_OPTIONS: Array<{
  value: ModuleMaterialType['type'];
  label: string;
}> = [
  { value: 'video', label: 'Урок (відео)' },
  { value: 'practice', label: 'Практика до уроку' },
  { value: 'quiz', label: 'Фінальний тест модуля' },
];
