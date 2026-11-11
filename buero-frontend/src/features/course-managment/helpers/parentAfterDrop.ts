import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

/**
 * Which lesson a dragged practice belongs to after it is dropped.
 *
 * Dragging a practice used to do nothing visible. The order was saved, but the list is drawn
 * as a tree by `orderWithPractice`, which puts every practice back under the lesson named in
 * its `parentMaterialId` - so the row sprang back and the author could not move a practice at
 * all. The order was never the thing to change here: the parent was.
 *
 * The rule is the one the list reads as:
 *
 * - dropped on a lesson, the practice becomes that lesson's practice
 * - dropped on another practice, it joins the lesson that practice belongs to
 * - dropped on anything else at the top level, such as a module test, it detaches and
 *   becomes a point of the module in its own right
 *
 * Returns `undefined` when nothing should change - the moved row is not a practice, or the
 * drop says nothing new - so the caller can leave the material exactly as it found it.
 */
export const parentAfterDrop = (
  materials: readonly ModuleMaterialType[],
  movedId: string,
  overId: string,
): string | null | undefined => {
  if (movedId === overId) return undefined;

  const moved = materials.find((material) => material.id === movedId);
  /** Only a practice hangs under a lesson, so only a practice has a parent to change. */
  if (!moved || moved.type !== 'practice') return undefined;

  const over = materials.find((material) => material.id === overId);
  if (!over) return undefined;

  const next =
    over.type === 'practice'
      ? /** Joining a sibling means joining its lesson, not hanging off the sibling. */
        (over.parentMaterialId ?? null)
      : over.type === 'video'
        ? over.id
        : /** A module test or anything else top-level is not something to hang under. */
          null;

  /** A practice can never be its own lesson. */
  if (next === movedId) return null;
  if (next === (moved.parentMaterialId ?? null)) return undefined;
  return next;
};
