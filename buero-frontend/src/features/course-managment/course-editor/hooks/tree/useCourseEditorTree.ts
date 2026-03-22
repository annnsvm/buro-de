import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { UseFormSetValue } from 'react-hook-form';

import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { apiInstance } from '@/api/apiInstance';
import { computeCourseDurationHoursFromVideoModules } from '@/features/course-managment/helpers/courseTreeStats.helpers';
import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

type UseCourseEditorTreeParams = {
  setValue: UseFormSetValue<CreateCourseFormValues>;
  setModules: Dispatch<SetStateAction<Modules[]>>;
  setIsCoursePublished: Dispatch<SetStateAction<boolean>>;
};

export const useCourseEditorTree = ({
  setValue,
  setModules,
  setIsCoursePublished,
}: UseCourseEditorTreeParams) => {
  const syncCourseDurationHours = useCallback(
    async (cid: string, nextModules: Modules[]) => {
      const hours = computeCourseDurationHoursFromVideoModules(nextModules);
      try {
        await apiInstance.patch(API_ENDPOINTS.courses.update(cid), {
          duration_hours: hours ?? null,
        });
        setValue('durationHours', hours === null ? '' : String(hours), { shouldDirty: false });
      } catch {
        /* ignore */
      }
    },
    [setValue],
  );

  const fetchCourseTree = useCallback(
    async (id: string) => {
      const res = await apiInstance.get<{
        modules?: Modules[];
        is_published?: boolean;
        isPublished?: boolean;
      }>(API_ENDPOINTS.courses.byId(id));
      const mods = res.data.modules ?? [];
      setModules(mods);
      const published = res.data.is_published ?? res.data.isPublished ?? false;
      setIsCoursePublished(published === true);
      await syncCourseDurationHours(id, mods);
    },
    [syncCourseDurationHours, setModules, setIsCoursePublished],
  );

  return { syncCourseDurationHours, fetchCourseTree };
};

export type UseCourseEditorTreeReturn = ReturnType<typeof useCourseEditorTree>;
