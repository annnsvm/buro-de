import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';

export type CourseProgressMaterialRow = {
  course_material_id: string;
  module_id?: string;
  completed_at: string;
  score: number | null;
};

export type CourseProgressResponse = {
  completed_materials: CourseProgressMaterialRow[];
};

export const fetchCourseProgress = async (courseId: string): Promise<CourseProgressResponse> => {
  const { data } = await apiInstance.get<CourseProgressResponse>(API_ENDPOINTS.progress.course(courseId));
  return data;
};

/** One course the student has started, and how far through it they are. */
export type MyProgressCourse = {
  course_id: string;
  course_title: string;
  completion_percent: number;
  completed_materials_count: number;
  total_materials_count: number;
};

export type MyProgressResponse = {
  courses: MyProgressCourse[];
  level: string | null;
};

/**
 * Progress across every course at once, for the list a student picks from.
 *
 * A course with nothing finished yet is simply absent, which reads as nought — asking
 * per course would mean one request per card.
 */
export const fetchMyProgress = async (): Promise<MyProgressResponse> => {
  const { data } = await apiInstance.get<MyProgressResponse>(API_ENDPOINTS.progress.me);
  return data;
};

export const completeCourseMaterial = async (
  courseId: string,
  moduleId: string,
  materialId: string,
): Promise<unknown> => {
  const { data } = await apiInstance.post(API_ENDPOINTS.progress.complete(courseId, moduleId, materialId), {});
  return data;
};
