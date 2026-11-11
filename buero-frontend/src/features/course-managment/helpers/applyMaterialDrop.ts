import { arrayMove } from '@dnd-kit/sortable';

import { parentAfterDrop } from './parentAfterDrop';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

/**
 * What a module's list looks like after something in it is dropped somewhere else.
 *
 * All of it is here, in one pure function, because the two halves have to agree and they did
 * not. The list is drawn by `orderWithPractice`, which sorts on each material's `orderIndex`
 * and places a practice under the lesson its `parentMaterialId` names. The drag handler only
 * moved things inside the array. An array position is not an `orderIndex`, so the sort put
 * every row straight back where it was and nothing could be reordered at all - not a
 * practice, not a lesson, not the module test. Re-parenting a practice looked like it worked
 * only because the tree honours the parent whatever the order says.
 */

/**
 * The array's own order, written into the field the list sorts on - and the same number the
 * server is about to store, since it numbers by position too.
 */
export const renumberMaterials = (
  materials: readonly ModuleMaterialType[],
): ModuleMaterialType[] =>
  materials.map((material, index) =>
    material.orderIndex === index ? material : { ...material, orderIndex: index },
  );

/**
 * Lets go of a lesson that is not in this module any more.
 *
 * A practice dragged into another module keeps pointing at the lesson it left behind. The
 * list would quietly draw it at the top level, and the server refuses the move outright,
 * which loses the whole reorder - so the tie is cut here, where it can be seen.
 */
export const detachMaterialsFromMissingLessons = (
  materials: readonly ModuleMaterialType[],
): ModuleMaterialType[] => {
  const present = new Set(materials.map((material) => material.id));
  return materials.map((material) =>
    material.parentMaterialId && !present.has(material.parentMaterialId)
      ? { ...material, parentMaterialId: null }
      : material,
  );
};

/** Both of the above, for a list that has just been rearranged. */
export const settleMaterials = (
  materials: readonly ModuleMaterialType[],
): ModuleMaterialType[] => renumberMaterials(detachMaterialsFromMissingLessons(materials));

/**
 * Moves `movedId` to where `overId` sits, and returns the module's materials as they should
 * now be stored and drawn. Returns the list unchanged when the drop says nothing.
 */
export const applyMaterialDrop = (
  materials: readonly ModuleMaterialType[],
  movedId: string,
  overId: string,
): ModuleMaterialType[] => {
  const from = materials.findIndex((material) => material.id === movedId);
  const to = materials.findIndex((material) => material.id === overId);
  if (from < 0 || to < 0) return materials as ModuleMaterialType[];

  /** Which lesson it belongs to now; `undefined` means the drop does not change that. */
  const nextParent = parentAfterDrop(materials, movedId, overId);

  const withParent =
    nextParent === undefined
      ? [...materials]
      : materials.map((material) =>
          material.id === movedId
            ? { ...material, parentMaterialId: nextParent }
            : material,
        );

  const moved = from === to ? withParent : arrayMove(withParent, from, to);
  return settleMaterials(moved);
};
