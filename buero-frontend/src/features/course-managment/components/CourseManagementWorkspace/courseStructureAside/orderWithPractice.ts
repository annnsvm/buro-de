/** The least a material must carry to be placed under its lesson. */
export type Placeable = {
  id: string;
  parentMaterialId?: string | null;
  orderIndex?: number;
};

export type PlacedMaterial<T extends Placeable> = {
  material: T;
  /** 0 for a lesson, 1 for the practice that hangs under it. */
  depth: number;
};

const byOrder = (a: Placeable, b: Placeable) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0);

/**
 * Puts each practice directly under the lesson it belongs to, and says how deep it sits.
 *
 * The author's list and the student's list used to disagree: the student saw a practice nested
 * under its lesson, while the author saw it last in the module, far from the lesson it was
 * attached to. With eight lessons in a module that is genuinely hard to read - the only way to
 * tell which lesson a practice belonged to was to open it.
 *
 * A practice whose lesson is not in this module stays at the top level rather than disappearing:
 * it can be orphaned because the lesson was deleted or moved, and hiding it would hide the work.
 */
export const orderWithPractice = <T extends Placeable>(
  materials: readonly T[],
): PlacedMaterial<T>[] => {
  const present = new Set(materials.map((material) => material.id));

  const childrenOf = new Map<string, T[]>();
  const roots: T[] = [];

  for (const material of materials) {
    const parentId = material.parentMaterialId;
    if (parentId && present.has(parentId) && parentId !== material.id) {
      childrenOf.set(parentId, [...(childrenOf.get(parentId) ?? []), material]);
    } else {
      roots.push(material);
    }
  }

  return roots
    .slice()
    .sort(byOrder)
    .flatMap((material) => [
      { material, depth: 0 },
      ...(childrenOf.get(material.id) ?? [])
        .slice()
        .sort(byOrder)
        .map((child) => ({ material: child, depth: 1 })),
    ]);
};
