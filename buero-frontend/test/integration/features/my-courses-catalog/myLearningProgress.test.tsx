import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ModalProvider } from '@/components/modal';
import { MyCoursesList } from '@/features/my-courses-catalog';
import { i18nReady } from '@/i18n';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';

import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The list a student picks a course from used to say nothing about any of them: the
 * only way to find out where you had got to was to open each course in turn.
 */
const course = (id: string, title: string) =>
  ({
    id,
    title,
    category: 'language',
    levelLabel: 'A2',
    imageUrl: '',
    description: 'Deutsch für den Beruf',
    price: '0',
    lessonsCount: 24,
    durationHours: 6,
    tags: ['language'],
  }) as unknown as CourseInfoData;

const courses = [course('c1', 'A2.1'), course('c2', 'B1.1')];

const renderList = (
  progressByCourseId?: ReadonlyMap<
    string,
    { percent: number; completed: number; total: number }
  >,
) => {
  renderWithProviders(
    <ModalProvider>
      <MyCoursesList courses={courses} progressByCourseId={progressByCourseId} />
    </ModalProvider>,
  );
};

/** Cards render in the order given, so position identifies them without a lookup. */
const cardAt = (index: number) =>
  screen.getAllByRole('article')[index] as HTMLElement;

describe('progress on the my-learning course list', () => {
  it('shows how far through each course the student is', async () => {
    await i18nReady;
    renderList(
      new Map([
        ['c1', { percent: 46, completed: 11, total: 24 }],
        ['c2', { percent: 0, completed: 0, total: 30 }],
      ]),
    );

    const first = within(cardAt(0));
    expect(first.getByText('46%')).toBeInTheDocument();
    expect(first.getByText('Пройдено 11 з 24')).toBeInTheDocument();

    const second = within(cardAt(1));
    expect(second.getByText('0%')).toBeInTheDocument();
  });

  it('fills the bar to the percentage reached', async () => {
    await i18nReady;
    renderList(new Map([['c1', { percent: 46, completed: 11, total: 24 }]]));

    const bar = within(cardAt(0)).getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '46');
    expect(bar.firstElementChild).toHaveStyle({ width: '46%' });
  });

  /**
   * Progress is read separately from the courses, so it can be missing while the list
   * itself is fine. The cards must still work — losing the bars is not losing the page.
   */
  it('still lists the courses when no progress is known', async () => {
    await i18nReady;
    renderList(undefined);

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('shows no bar for a course that has not been started', async () => {
    await i18nReady;
    renderList(new Map([['c2', { percent: 10, completed: 3, total: 30 }]]));

    expect(within(cardAt(0)).queryByRole('progressbar')).not.toBeInTheDocument();
    expect(within(cardAt(1)).getByRole('progressbar')).toBeInTheDocument();
  });
});
