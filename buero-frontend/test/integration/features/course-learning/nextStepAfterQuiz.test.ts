import { describe, expect, it } from 'vitest';

import {
  findNextMaterialId,
  findNextModuleFirstMaterialId,
} from '@/pages/CoursePage/coursePageMappers';

/**
 * Where a finished quiz leads.
 *
 * Until these existed, a quiz led nowhere: the only way on was the sidebar. The helper
 * that did exist looked for the next *video*, so "next lesson" also stepped over the
 * quiz belonging to the lesson just watched.
 */
const flat = [
  { moduleId: 'm4', material: { id: '4.1', type: 'video' } },
  { moduleId: 'm4', material: { id: '4.1-quiz', type: 'quiz' } },
  { moduleId: 'm4', material: { id: '4.2', type: 'video' } },
  { moduleId: 'm4', material: { id: 'test-4', type: 'quiz' } },
  { moduleId: 'm5', material: { id: '5.1', type: 'video' } },
  { moduleId: 'm5', material: { id: '5.1-quiz', type: 'quiz' } },
] as Parameters<typeof findNextMaterialId>[0];

describe('the next lesson after a practice quiz', () => {
  it('is the quiz that belongs to the lesson, not the lesson after it', () => {
    expect(findNextMaterialId(flat, '4.1')).toBe('4.1-quiz');
  });

  it('leads out of a quiz rather than stopping at it', () => {
    expect(findNextMaterialId(flat, '4.1-quiz')).toBe('4.2');
  });

  it('crosses into the next module when the module is done', () => {
    expect(findNextMaterialId(flat, 'test-4')).toBe('5.1');
  });

  it('has nowhere to go from the last lesson of the course', () => {
    expect(findNextMaterialId(flat, '5.1-quiz')).toBeNull();
  });
});

describe('the next module after a test', () => {
  it('opens the first lesson of the module that follows', () => {
    expect(findNextModuleFirstMaterialId(flat, 'test-4')).toBe('5.1');
  });

  /**
   * A test need not be the last thing in its module. Finishing it still means the module
   * is behind you, so the step is over the boundary rather than simply forward.
   */
  it('skips whatever still follows inside the same module', () => {
    expect(findNextModuleFirstMaterialId(flat, '4.1-quiz')).toBe('5.1');
  });

  it('has nowhere to go from the last module', () => {
    expect(findNextModuleFirstMaterialId(flat, '5.1')).toBeNull();
  });

  it('says nothing for a lesson that is not in the course', () => {
    expect(findNextModuleFirstMaterialId(flat, 'stale-id')).toBeNull();
    expect(findNextMaterialId(flat, 'stale-id')).toBeNull();
  });
});
