import { describe, expect, it } from 'vitest';

import {
  applyMaterialDrop,
  renumberMaterials,
  settleMaterials,
} from '@/features/course-managment/helpers/applyMaterialDrop';
import { orderWithPractice } from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside/orderWithPractice';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

/**
 * Rearranging a module, as the author sees it.
 *
 * The author reported that a practice could be moved under another lesson but nothing could
 * be swapped - not two practices, not the module test. The cause was that the drag moved
 * things inside the array while the list is drawn by sorting on `orderIndex`, which the drag
 * never touched: the sort put every row straight back. Re-parenting looked like it worked
 * only because the tree honours the parent whatever the order says.
 *
 * So these assert the drawn order, through `orderWithPractice`, rather than array positions.
 * An assertion on the array alone would have passed all along.
 */

const material = (
  id: string,
  type: ModuleMaterialType['type'],
  orderIndex: number,
  parentMaterialId: string | null = null,
): ModuleMaterialType => ({ id, type, orderIndex, parentMaterialId });

/** Lesson 1 with its practice, lesson 2 with its practice, then the module test. */
const MODULE: ModuleMaterialType[] = [
  material('l1', 'video', 0),
  material('p1', 'practice', 1, 'l1'),
  material('l2', 'video', 2),
  material('p2', 'practice', 3, 'l2'),
  material('test', 'quiz', 4),
];

/** What the editor actually draws for a module. */
const drawn = (materials: readonly ModuleMaterialType[]) =>
  orderWithPractice(materials).map((entry) => entry.material.id);

const drop = (materials: readonly ModuleMaterialType[], moved: string, over: string) =>
  drawn(applyMaterialDrop(materials, moved, over));

describe('the list before anything is dragged', () => {
  it('draws each lesson with its own practice under it', () => {
    expect(drawn(MODULE)).toEqual(['l1', 'p1', 'l2', 'p2', 'test']);
  });
});

describe('swapping two things at the top level', () => {
  it('swaps two lessons, and their practices travel with them', () => {
    expect(drop(MODULE, 'l1', 'l2')).toEqual(['l2', 'p2', 'l1', 'p1', 'test']);
  });

  it('moves the module test to the front', () => {
    expect(drop(MODULE, 'test', 'l1')).toEqual(['test', 'l1', 'p1', 'l2', 'p2']);
  });

  it('moves a lesson past the test to the end', () => {
    expect(drop(MODULE, 'l1', 'test')).toEqual(['l2', 'p2', 'test', 'l1', 'p1']);
  });
});

describe('swapping two practices of the same lesson', () => {
  const twoOnOne: ModuleMaterialType[] = [
    material('l1', 'video', 0),
    material('pA', 'practice', 1, 'l1'),
    material('pB', 'practice', 2, 'l1'),
    material('test', 'quiz', 3),
  ];

  it('puts the second one first', () => {
    expect(drop(twoOnOne, 'pB', 'pA')).toEqual(['l1', 'pB', 'pA', 'test']);
  });

  it('leaves both under the same lesson', () => {
    const after = applyMaterialDrop(twoOnOne, 'pB', 'pA');
    for (const id of ['pA', 'pB']) {
      expect(after.find((m) => m.id === id)?.parentMaterialId).toBe('l1');
    }
  });
});

describe('moving a practice to another lesson', () => {
  it('draws it under the lesson it was dropped on', () => {
    expect(drop(MODULE, 'p1', 'l2')).toEqual(['l1', 'l2', 'p1', 'p2', 'test']);
  });

  it('detaches it when it is dropped on the module test', () => {
    const after = applyMaterialDrop(MODULE, 'p1', 'test');
    expect(after.find((m) => m.id === 'p1')?.parentMaterialId).toBeNull();
  });
});

describe('the numbering the server will be sent', () => {
  /**
   * The list sorts on `orderIndex` and the server stores the array position. They have to be
   * the same number, or the screen and the database disagree about what just happened.
   */
  it('numbers every material by its place in the list', () => {
    const after = applyMaterialDrop(MODULE, 'l1', 'l2');
    expect(after.map((m) => m.orderIndex)).toEqual([0, 1, 2, 3, 4]);
  });

  it('renumbers a list that was never numbered at all', () => {
    const unnumbered = [
      { id: 'a', type: 'video' as const },
      { id: 'b', type: 'video' as const },
    ];
    expect(renumberMaterials(unnumbered).map((m) => m.orderIndex)).toEqual([0, 1]);
  });
});

describe('a practice whose lesson is no longer in the module', () => {
  /**
   * It has been dragged into another module and left its lesson behind. The server refuses a
   * lesson from a different module, and refusing loses the whole reorder, so the tie is cut
   * here instead.
   */
  it('lets go of the lesson it left behind', () => {
    const landed = settleMaterials([
      material('other', 'video', 0),
      material('p1', 'practice', 1, 'l1'),
    ]);
    expect(landed.find((m) => m.id === 'p1')?.parentMaterialId).toBeNull();
  });

  it('keeps a lesson that did come along', () => {
    const landed = settleMaterials([
      material('l1', 'video', 0),
      material('p1', 'practice', 1, 'l1'),
    ]);
    expect(landed.find((m) => m.id === 'p1')?.parentMaterialId).toBe('l1');
  });
});

describe('a drop that says nothing', () => {
  it('leaves the list alone when the row is dropped on itself', () => {
    expect(drop(MODULE, 'p1', 'p1')).toEqual(drawn(MODULE));
  });

  it('leaves the list alone when the target is not in this module', () => {
    expect(drop(MODULE, 'p1', 'elsewhere')).toEqual(drawn(MODULE));
  });
});
