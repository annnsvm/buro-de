import type { CourseMaterial } from './CourseStructure';

export type NestedMaterial = {
  material: CourseMaterial;
  /** The practice that belongs to this lesson, if it has one. */
  children: CourseMaterial[];
};

const byOrder = (a: CourseMaterial, b: CourseMaterial) =>
  (a.orderIndex ?? 0) - (b.orderIndex ?? 0);

/**
 * Arranges a module's flat list of materials into lessons with their practice underneath.
 *
 * One level deep, and deliberately so: a lesson is a video, and a practice hangs off it. There is
 * no lesson entity and none is needed — nesting is a property of the material, which is why this
 * arrived without moving a single row.
 *
 * A practice whose parent is missing from the list is not dropped. It could be orphaned because
 * the lesson was deleted, or because the parent sits in another module; either way, hiding work a
 * student has already done would be worse than showing it at the top level, where it behaves
 * exactly as a quiz always has.
 */
export const nestMaterials = (materials: readonly CourseMaterial[]): NestedMaterial[] => {
  const present = new Set(materials.map((material) => material.id));

  const childrenOf = new Map<string, CourseMaterial[]>();
  const roots: CourseMaterial[] = [];

  for (const material of materials) {
    const parentId = material.parentMaterialId;
    if (parentId && present.has(parentId)) {
      childrenOf.set(parentId, [...(childrenOf.get(parentId) ?? []), material]);
    } else {
      roots.push(material);
    }
  }

  return roots
    .slice()
    .sort(byOrder)
    .map((material) => ({
      material,
      children: (childrenOf.get(material.id) ?? []).slice().sort(byOrder),
    }));
};

/**
 * Flattens the tree back into the order a student walks through it: each lesson, then its
 * practice. "Next lesson" and the progress count both follow this order, so the step after a
 * video is its own practice rather than the video after it.
 */
export const flattenNested = (nested: readonly NestedMaterial[]): CourseMaterial[] =>
  nested.flatMap((entry) => [entry.material, ...entry.children]);
