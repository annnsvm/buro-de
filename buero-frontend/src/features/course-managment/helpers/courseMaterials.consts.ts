import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

export const MATERIAL_TYPE_OPTIONS: Array<{ value: ModuleMaterialType['type']; label: string }> = [
  { value: 'video', label: 'Video' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'practice', label: 'Practice (under a lesson)' },
  { value: 'writing', label: 'Writing task' },
];

