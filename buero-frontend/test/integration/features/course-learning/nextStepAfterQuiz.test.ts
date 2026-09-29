import { describe, expect, it } from 'vitest';

import {
  findNextMaterialId,
  findNextModuleFirstMaterialId,
  nextStepKind,
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

describe('naming the step that follows', () => {
  /**
   * Telling a student they are going "to the next lesson" when the module test is what comes
   * next is the kind of small inaccuracy that makes an interface feel careless — and a test is
   * a step they may want to approach deliberately.
   */
  it('names a practice, a test and a lesson differently', () => {
    expect(nextStepKind({ id: 'p', type: 'practice', title: '' })).toBe('practice');
    expect(nextStepKind({ id: 't', type: 'quiz', title: '', quizMode: 'test' })).toBe('test');
    expect(nextStepKind({ id: 'v', type: 'video', title: '' })).toBe('lesson');
    expect(nextStepKind({ id: 'w', type: 'writing', title: '' })).toBe('writing');
  });

  /** An older lesson quiz is practice by another name; only a test is a test. */
  it('treats a lesson quiz as practice', () => {
    expect(nextStepKind({ id: 'q', type: 'quiz', title: '', quizMode: 'practice' })).toBe(
      'practice',
    );
    expect(nextStepKind({ id: 'q', type: 'quiz', title: '' })).toBe('practice');
  });

  it('falls back to a lesson when there is nothing to name', () => {
    expect(nextStepKind(undefined)).toBe('lesson');
  });
});
