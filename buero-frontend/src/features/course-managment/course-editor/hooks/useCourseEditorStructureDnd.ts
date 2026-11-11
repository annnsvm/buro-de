import { useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import * as courseApi from '@/api/courseManagementApi';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';

type UseCourseEditorStructureDndParams = {
  courseId: string | null;
  setModules: Dispatch<SetStateAction<Modules[]>>;
  fetchCourseTree: (id: string) => Promise<void>;
};

export const useCourseEditorStructureDnd = ({
  courseId,
  setModules,
  fetchCourseTree,
}: UseCourseEditorStructureDndParams) => {
  const persistStructure = useCallback(
    async (next: Modules[]) => {
      if (!courseId) return;
      setModules(next);
      try {
        await courseApi.reorderCourseStructure(
          courseId,
          next.map((mod, index) => ({
            id: mod.id,
            order_index: index,
            materials: mod.materials.map((material, materialIndex) => ({
              id: material.id,
              order_index: materialIndex,
              /**
               * Sent on every row, because a practice is placed in the list by its lesson
               * rather than by its position, and a drag that re-parents one has nothing
               * else to carry the change.
               */
              parent_material_id: material.parentMaterialId ?? null,
            })),
          })),
        );
      } catch (error) {
        await fetchCourseTree(courseId);
        throw error;
      }
    },
    [courseId, fetchCourseTree, setModules],
  );

  return { persistStructure };
};
