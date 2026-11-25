import type { Dispatch, SetStateAction } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

export type UseCourseEditorTreeParams = {
  setValue: UseFormSetValue<CreateCourseFormValues>;
  /**
   * Whether the course duration was set by hand, read at the moment it is needed rather
   * than captured when the hook was built - the sync runs long after that.
   */
  getIsDurationManual: () => boolean;
  setModules: Dispatch<SetStateAction<Modules[]>>;
  setIsCoursePublished: Dispatch<SetStateAction<boolean>>;
};
