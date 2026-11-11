import { describe, expect, it } from 'vitest';

import { parentAfterDrop } from '@/features/course-managment/helpers/parentAfterDrop';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';

/**
 * Where a practice lands when it is dragged.
 *
 * The author reported that practices could not be moved at all: the order was saved, but the
 * list is drawn as a tree, so every practice sprang back under the lesson its
 * `parentMaterialId` named. Order was the wrong thing to change - the parent was.
 */

const material = (
  id: string,
  type: ModuleMaterialType['type'],
  parentMaterialId: string | null = null,
): ModuleMaterialType => ({ id, type, parentMaterialId });

const LESSON_1 = material('l1', 'video');
const LESSON_2 = material('l2', 'video');
const TEST = material('t1', 'quiz');
const PRACTICE_1 = material('p1', 'practice', 'l1');
const PRACTICE_2 = material('p2', 'practice', 'l2');
const LOOSE = material('p3', 'practice', null);

const MODULE = [LESSON_1, PRACTICE_1, LESSON_2, PRACTICE_2, TEST, LOOSE];

describe('dragging a practice', () => {
  it('moves it to the lesson it was dropped on', () => {
    expect(parentAfterDrop(MODULE, 'p1', 'l2')).toBe('l2');
  });

  it('joins the lesson of the practice it was dropped on', () => {
    expect(parentAfterDrop(MODULE, 'p1', 'p2')).toBe('l2');
  });

  it('detaches it when dropped on the module test', () => {
    expect(parentAfterDrop(MODULE, 'p1', 't1')).toBeNull();
  });

  it('attaches a loose practice to the lesson it is dropped on', () => {
    expect(parentAfterDrop(MODULE, 'p3', 'l1')).toBe('l1');
  });

  it('says nothing when it is already that lesson’s practice', () => {
    expect(parentAfterDrop(MODULE, 'p1', 'l1')).toBeUndefined();
  });

  it('says nothing when it joins a sibling of its own lesson', () => {
    const sibling = material('p4', 'practice', 'l1');
    expect(parentAfterDrop([...MODULE, sibling], 'p1', 'p4')).toBeUndefined();
  });

  /**
   * A practice parented to another practice should not exist, but if one does, dropping it
   * on that practice repairs it: it joins a real lesson instead of staying nested.
   */
  it('repairs a practice nested under another practice', () => {
    const nested = material('p5', 'practice', 'p1');
    expect(parentAfterDrop([...MODULE, nested], 'p5', 'p1')).toBe('l1');
  });

  /** The guard that matters: a practice can never end up as its own lesson. */
  it('never makes a practice its own lesson', () => {
    const nested = material('p5', 'practice', 'p1');
    expect(parentAfterDrop([...MODULE, nested], 'p1', 'p5')).toBeNull();
  });
});

describe('dragging anything that is not a practice', () => {
  it('leaves a lesson alone', () => {
    expect(parentAfterDrop(MODULE, 'l1', 'l2')).toBeUndefined();
  });

  it('leaves a module test alone', () => {
    expect(parentAfterDrop(MODULE, 't1', 'l1')).toBeUndefined();
  });
});

describe('a drop that says nothing', () => {
  it('ignores a row dropped on itself', () => {
    expect(parentAfterDrop(MODULE, 'p1', 'p1')).toBeUndefined();
  });

  it('ignores a row that is not in this module', () => {
    expect(parentAfterDrop(MODULE, 'p1', 'gone')).toBeUndefined();
  });
});
