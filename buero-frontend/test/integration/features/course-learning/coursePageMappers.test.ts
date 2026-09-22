import { describe, expect, it } from 'vitest';

import {
  type ApiCourseWithTree,
  applyTrialModuleScope,
  findLockedModuleIds,
  formatMaterialDuration,
  hasAnyUnlockedMaterial,
  scopeToUnlockedModules,
} from '@/pages/CoursePage/coursePageMappers';

/**
 * The server withholds `content` for modules the viewer has not paid for and marks
 * them `locked`. These helpers are what turns that into what the learner sees, so a
 * regression here either hides paid lessons or shows locked ones as openable.
 */
const course = (modules: ApiCourseWithTree['modules']): ApiCourseWithTree => ({
  id: 'course-1',
  title: 'A2.1',
  modules,
});

describe('coursePageMappers access scoping', () => {
  const openModule = {
    id: 'mod-1',
    title: 'Module 1',
    materials: [
      { id: 'mat-1', title: 'Lesson 1', type: 'video', locked: false, duration: '07:12' },
    ],
  };
  const lockedModule = {
    id: 'mod-2',
    title: 'Module 2',
    materials: [
      { id: 'mat-2', title: 'Lesson 2', type: 'video', locked: true, duration: '05:00' },
    ],
  };

  it('keeps only the modules the server unlocked', () => {
    const scoped = scopeToUnlockedModules(course([openModule, lockedModule]));
    expect(scoped.modules?.map((mod) => mod.id)).toEqual(['mod-1']);
  });

  it('reports locked modules so the outline can mark them', () => {
    expect(findLockedModuleIds(course([openModule, lockedModule]))).toEqual(
      new Set(['mod-2']),
    );
  });

  it('does not call an empty module locked', () => {
    const empty = { id: 'mod-3', title: 'Module 3', materials: [] };
    expect(findLockedModuleIds(course([empty]))).toEqual(new Set());
    expect(scopeToUnlockedModules(course([empty])).modules).toHaveLength(1);
  });

  it('detects a course with nothing to study', () => {
    expect(hasAnyUnlockedMaterial(course([lockedModule]))).toBe(false);
    expect(hasAnyUnlockedMaterial(course([openModule, lockedModule]))).toBe(true);
  });

  it('treats a response without the locked flag as open', () => {
    const legacy = {
      id: 'mod-4',
      title: 'Module 4',
      materials: [{ id: 'mat-4', title: 'Lesson', type: 'video' }],
    };
    expect(hasAnyUnlockedMaterial(course([legacy]))).toBe(true);
    expect(findLockedModuleIds(course([legacy]))).toEqual(new Set());
  });
});

describe('applyTrialModuleScope', () => {
  const threeModules = [
    { id: 'mod-0', title: 'How to study here', materials: [] },
    { id: 'mod-1', title: 'Module 1', materials: [] },
    { id: 'mod-2', title: 'Module 2', materials: [] },
  ];

  it('shows every module the trial opens, not just the first', () => {
    const scoped = applyTrialModuleScope({
      ...course(threeModules),
      my_access: { access_type: 'trial', trial_module_ids: ['mod-0', 'mod-1'] },
    });
    expect(scoped.modules?.map((mod) => mod.id)).toEqual(['mod-0', 'mod-1']);
  });

  it('falls back to first_module_id when the list is absent', () => {
    const scoped = applyTrialModuleScope({
      ...course(threeModules),
      my_access: { access_type: 'trial', first_module_id: 'mod-0' },
    });
    expect(scoped.modules?.map((mod) => mod.id)).toEqual(['mod-0']);
  });

  it('leaves a fully paid course untouched', () => {
    const scoped = applyTrialModuleScope({
      ...course(threeModules),
      my_access: { access_type: 'purchase' },
    });
    expect(scoped.modules).toHaveLength(3);
  });
});

describe('formatMaterialDuration', () => {
  it('uses the duration served next to a locked lesson', () => {
    expect(
      formatMaterialDuration({
        id: 'mat-1',
        title: 'Lesson',
        type: 'video',
        locked: true,
        duration: '07:12',
        content: null,
      }),
    ).toBe('07:12');
  });

  it('falls back to the duration inside content', () => {
    expect(
      formatMaterialDuration({
        id: 'mat-1',
        title: 'Lesson',
        type: 'video',
        content: { duration: '03:45' },
      }),
    ).toBe('03:45');
  });

  it('returns a dash when no duration is known', () => {
    expect(
      formatMaterialDuration({ id: 'mat-1', title: 'Quiz', type: 'quiz', content: null }),
    ).toBe('-');
  });
});
