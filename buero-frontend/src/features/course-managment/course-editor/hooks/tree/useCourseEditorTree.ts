import { useCallback } from 'react';

import * as courseApi from '@/api/courseManagementApi';
import { hoursFromVideos } from '@/features/course-managment/domain/hoursFromVideos';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import type { UseCourseEditorTreeParams } from '@/types/features/courseManagment/CourseEditorHookParams.types';

export const useCourseEditorTree = ({
  setValue,
  getIsDurationManual,
  setModules,
  setIsCoursePublished,
}: UseCourseEditorTreeParams) => {  /**
   * Keeps the course's hours in step with the videos in it.
   *
   * Runs on every structure change and on opening the course, which is what makes the
   * figure trustworthy without anyone maintaining it - and is exactly why it has to stand
   * down when the author has given their own. The server refuses such a write as well; the
   * check here is so the form on screen is not changed under them either.
   */
  const syncCourseDurationHours = useCallback(
    async (cid: string, nextModules: Modules[]) => {
      if (getIsDurationManual()) return;
      const hours = hoursFromVideos(nextModules);
      try {
        await courseApi.patchCourse(cid, {
          duration_hours: hours ?? null,
        });
        setValue('durationHours', hours === null ? '' : String(hours), { shouldDirty: false });
      } catch {
        /**
         * Left unsaid on purpose. This runs behind whatever the author was actually doing -
         * adding a lesson, opening the course - and a figure in a tile that is briefly out
         * of date is not worth an error message interrupting that. The next change syncs it.
         */
        void 0;
      }
    },
    [setValue, getIsDurationManual],
  );

  const fetchCourseTree = useCallback(
    async (id: string) => {
      const res = await courseApi.fetchCourseById(id);
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