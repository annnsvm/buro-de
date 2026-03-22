import { useEffect, useLayoutEffect } from 'react';

import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { apiInstance } from '@/api/apiInstance';
import {
  getCoursePublishedFromApi,
  mapApiCourseToCourseEditorFormValues,
  type ApiCourseTreeResponse,
} from '@/features/course-managment/helpers/mapApiCourseToCourseEditorForm.helpers';
import { ROUTES } from '@/helpers/routes';

import { parseApiErrorMessage } from '@/features/course-managment/course-editor/utils/parseApiErrorMessage';

import type { UseCourseEditorStateReturn } from '../state/useCourseEditorState';
import type { UseCourseEditorTreeReturn } from '../tree/useCourseEditorTree';

type UseCourseEditorEffectsParams = {
  pathname: string;
  routeCourseId: string | undefined;
  state: UseCourseEditorStateReturn;
  tree: UseCourseEditorTreeReturn;
};

export const useCourseEditorEffects = ({
  pathname,
  routeCourseId,
  state,
  tree,
}: UseCourseEditorEffectsParams) => {
  const {
    resetEditorToEmpty,
    setIsBootstrappingCourse,
    setCreateCourseError,
    reset,
    setCourseId,
    setModules,
    setIsCoursePublished,
    setIsEditingCourse,
    setCoverFile,
    setCoverPreviewUrl,
  } = state;

  const { syncCourseDurationHours } = tree;
  useEffect(() => {
    const isBlankEditor =
      pathname === ROUTES.TEACHER_COURSES_CREATE || pathname === ROUTES.COURSE_MANAGEMENT;
    if (!isBlankEditor) return;
    resetEditorToEmpty();
  }, [pathname, resetEditorToEmpty]);

  useLayoutEffect(() => {
    setIsBootstrappingCourse(Boolean(routeCourseId));
  }, [routeCourseId, setIsBootstrappingCourse]);

  useEffect(() => {
    if (!routeCourseId) return;

    let cancelled = false;
    setCreateCourseError(null);

    const load = async () => {
      try {
        const res = await apiInstance.get(API_ENDPOINTS.courses.byId(routeCourseId));
        if (cancelled) return;
        const data = res.data as ApiCourseTreeResponse;
        const formValues = mapApiCourseToCourseEditorFormValues(data);
        reset(formValues);
        setCourseId(routeCourseId);
        setModules(data.modules ?? []);
        setIsCoursePublished(getCoursePublishedFromApi(data));
        setIsEditingCourse(true);
        setCoverFile(null);
        setCoverPreviewUrl(null);
        await syncCourseDurationHours(routeCourseId, data.modules ?? []);
      } catch (err: unknown) {
        if (cancelled) return;
        setCreateCourseError(parseApiErrorMessage(err, 'Failed to load course'));
        setCourseId(null);
        setModules([]);
      } finally {
        if (!cancelled) setIsBootstrappingCourse(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    routeCourseId,
    reset,
    setCoverFile,
    setCoverPreviewUrl,
    setCourseId,
    setCreateCourseError,
    setIsCoursePublished,
    setIsEditingCourse,
    setModules,
    syncCourseDurationHours,
    setIsBootstrappingCourse,
  ]);
};
