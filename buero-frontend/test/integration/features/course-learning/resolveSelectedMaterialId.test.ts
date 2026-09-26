import { describe, expect, it } from 'vitest';

import { resolveSelectedMaterialId } from '@/pages/CoursePage/coursePageMappers';

/**
 * Which lesson a course opens at.
 *
 * The lesson is carried in the address, so this is what makes a refresh, the back
 * button and a bookmark land where the student was. Before, the lesson lived in
 * component state and every one of those put them back at lesson one.
 */
describe('resolveSelectedMaterialId', () => {
  const flat = [
    { moduleId: 'm1', material: { id: '4.1', type: 'video' } },
    { moduleId: 'm1', material: { id: '4.2', type: 'quiz' } },
    { moduleId: 'm2', material: { id: '4.3', type: 'video' } },
  ];
  const nothingDone = new Set<string>();

  describe('when the address names a lesson', () => {
    it('opens that one', () => {
      expect(resolveSelectedMaterialId(flat, '4.2', nothingDone)).toBe('4.2');
    });

    it('opens it even when it is already finished', () => {
      // Going back over a finished lesson is ordinary; the link must be obeyed.
      expect(resolveSelectedMaterialId(flat, '4.1', new Set(['4.1']))).toBe('4.1');
    });
  });

  describe('when the address names nothing usable', () => {
    it('resumes at the first unfinished lesson', () => {
      expect(resolveSelectedMaterialId(flat, null, new Set(['4.1']))).toBe('4.2');
    });

    it('treats a stale or locked lesson id the same as none', () => {
      // A bookmark to a lesson in a module this student cannot open.
      expect(resolveSelectedMaterialId(flat, 'mat-from-module-9', new Set(['4.1']))).toBe(
        '4.2',
      );
    });

    it('starts at the beginning on a first visit', () => {
      expect(resolveSelectedMaterialId(flat, null, nothingDone)).toBe('4.1');
    });

    it('skips over a run of finished lessons', () => {
      expect(resolveSelectedMaterialId(flat, null, new Set(['4.1', '4.2']))).toBe('4.3');
    });

    it('lands on the last lesson once the whole course is done', () => {
      expect(
        resolveSelectedMaterialId(flat, null, new Set(['4.1', '4.2', '4.3'])),
      ).toBe('4.3');
    });
  });

  it('has nothing to open in an empty course', () => {
    expect(resolveSelectedMaterialId([], null, nothingDone)).toBeNull();
  });
});
