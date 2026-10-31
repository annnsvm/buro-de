import { describe, expect, it } from 'vitest';
import { orderWithPractice } from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside/orderWithPractice';

/**
 * The author's view of a module, arranged the way the student's already is.
 *
 * The two lists disagreed: a practice sat last in the author's module however many lessons were
 * above it, so the only way to learn which lesson it belonged to was to open it.
 */
const material = (id: string, orderIndex: number, parentMaterialId?: string) => ({
  id,
  orderIndex,
  parentMaterialId,
});

const ids = (placed: ReturnType<typeof orderWithPractice>) =>
  placed.map((entry) => entry.material.id);

describe('placing a practice under its lesson in the author’s list', () => {
  it('puts the practice straight after the lesson, not at the end', () => {
    const placed = orderWithPractice([
      material('4.1', 0),
      material('4.2', 1),
      material('4.1p', 9, '4.1'),
    ]);

    expect(ids(placed)).toEqual(['4.1', '4.1p', '4.2']);
  });

  it('marks how deep each row sits, so one can be indented', () => {
    const placed = orderWithPractice([material('4.1', 0), material('4.1p', 1, '4.1')]);
    expect(placed.map((entry) => entry.depth)).toEqual([0, 1]);
  });

  it('keeps several lessons each with their own practice in order', () => {
    const placed = orderWithPractice([
      material('4.1', 0),
      material('4.2', 1),
      material('4.2p', 8, '4.2'),
      material('4.1p', 9, '4.1'),
    ]);

    expect(ids(placed)).toEqual(['4.1', '4.1p', '4.2', '4.2p']);
  });

  /** Work must never vanish from the list because its lesson was deleted. */
  it('shows a practice whose lesson is not here at the top level', () => {
    const placed = orderWithPractice([material('4.1', 0), material('orphan', 1, 'gone')]);

    expect(ids(placed)).toEqual(['4.1', 'orphan']);
    expect(placed.map((entry) => entry.depth)).toEqual([0, 0]);
  });

  /** A material naming itself as its own parent must not drop out of the list. */
  it('survives a material that points at itself', () => {
    const placed = orderWithPractice([material('loop', 0, 'loop')]);
    expect(ids(placed)).toEqual(['loop']);
  });

  it('leaves a module of plain lessons exactly as it was', () => {
    const placed = orderWithPractice([material('b', 1), material('a', 0)]);
    expect(ids(placed)).toEqual(['a', 'b']);
  });
});
