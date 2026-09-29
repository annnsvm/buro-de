import { describe, expect, it } from 'vitest';

import { flattenNested, nestMaterials } from '@/features/courses-catalog/nestMaterials';
import type { CourseMaterial } from '@/features/courses-catalog/CourseStructure';
import { mapApiModulesToCourseStructure } from '@/pages/CoursePage/coursePageMappers';

/**
 * Turning a module's flat material list into lessons with their practice underneath.
 *
 * The nesting is a property of the material rather than a new level of hierarchy, which is what
 * let it arrive without moving any existing row — so the important cases here are the ones where
 * a parent is absent or a lesson has none.
 */
const material = (
  id: string,
  over: Partial<CourseMaterial> = {},
): CourseMaterial => ({
  id,
  moduleId: 'm1',
  type: 'video',
  title: id,
  ...over,
});

describe('nesting a practice under its lesson', () => {
  it('puts the practice under the video it belongs to', () => {
    const nested = nestMaterials([
      material('4.1', { orderIndex: 0 }),
      material('4.1p', { orderIndex: 1, type: 'practice', parentMaterialId: '4.1' }),
    ]);

    expect(nested).toHaveLength(1);
    expect(nested[0].material.id).toBe('4.1');
    expect(nested[0].children.map((c) => c.id)).toEqual(['4.1p']);
  });

  it('leaves a lesson without practice with no children', () => {
    const nested = nestMaterials([material('4.2')]);
    expect(nested[0].children).toEqual([]);
  });

  /**
   * How every existing quiz behaves: no parent, so it stands at the top level exactly as before.
   * This is why the nesting needed no migration.
   */
  it('keeps a material with no parent at the top level', () => {
    const nested = nestMaterials([
      material('4.1', { orderIndex: 0 }),
      material('quiz', { orderIndex: 1, type: 'quiz' }),
    ]);
    expect(nested.map((entry) => entry.material.id)).toEqual(['4.1', 'quiz']);
  });

  /** Hiding work a student has already done would be worse than showing it unnested. */
  it('does not lose a practice whose parent is not in the list', () => {
    const nested = nestMaterials([
      material('orphan', { type: 'practice', parentMaterialId: 'deleted-video' }),
    ]);
    expect(nested.map((entry) => entry.material.id)).toEqual(['orphan']);
  });

  it('orders lessons and their practice by the author\'s arrangement', () => {
    const nested = nestMaterials([
      material('4.2', { orderIndex: 2 }),
      material('4.1', { orderIndex: 0 }),
      material('4.1p', { orderIndex: 1, type: 'practice', parentMaterialId: '4.1' }),
    ]);
    expect(nested.map((entry) => entry.material.id)).toEqual(['4.1', '4.2']);
  });
});

describe('the order a student walks through', () => {
  it('puts the practice straight after its own lesson, not after the next video', () => {
    const flat = flattenNested(
      nestMaterials([
        material('4.1', { orderIndex: 0 }),
        material('4.2', { orderIndex: 2 }),
        material('4.1p', { orderIndex: 1, type: 'practice', parentMaterialId: '4.1' }),
      ]),
    );
    expect(flat.map((m) => m.id)).toEqual(['4.1', '4.1p', '4.2']);
  });
});

describe('what the student sidebar is given', () => {
  /**
   * The nesting is drawn from `parentMaterialId`, so a mapper that quietly drops it leaves the
   * student with a flat list while the teacher sees the tree — which is exactly what happened.
   */
  it('keeps the lesson link and the blocks when mapping for the sidebar', () => {
    const mapped = mapApiModulesToCourseStructure([
      {
        id: 'm1',
        title: 'Модуль 4',
        materials: [
          { id: '4.1', type: 'video', title: '4.1', orderIndex: 0 },
          {
            id: '4.1p',
            type: 'practice',
            title: 'Практика 4.1',
            orderIndex: 1,
            parentMaterialId: '4.1',
            blocks: ['grammatik'],
          },
        ],
      },
    ]);

    const practice = mapped[0].materials.find((m) => m.id === '4.1p');
    expect(practice?.parentMaterialId).toBe('4.1');
    expect(practice?.blocks).toEqual(['grammatik']);

    // And so the list actually nests.
    const nested = nestMaterials(mapped[0].materials);
    expect(nested).toHaveLength(1);
    expect(nested[0].children.map((c) => c.id)).toEqual(['4.1p']);
  });
});
