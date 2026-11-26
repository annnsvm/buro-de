import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { useLocation } from 'react-router-dom';

import CourseCard from '@/features/courses-catalog/CourseCard';
import ModalProvider from '@/components/modal/context/ModalProvider';
import {
  mapApiCourseToCourseCard,
  mapApiCourseToCourseInfo,
} from '@/api/myLearningCourses';
import { courseAccessKind } from '@/features/courses-catalog/courseAccessModal.helpers';
import { i18nReady } from '@/i18n';
import { TEST_API_BASE_URL } from '../../../constants';
import { server } from '../../../mocks/server';
import { renderWithProviders } from '../../../utils/renderWithProviders';
import type { CourseCardProps } from '@/types/features/courses-catalog/CourseCard.types';

/**
 * Only a course that was bought simply carries on.
 *
 * A trial is an unbought course two modules of which happen to be open, and it used to be
 * drawn as a bought one: "Продовжити навчання", no price, nothing left to buy. So the
 * catalogue's own panel - the price, "try" and "buy" - is what a trial gets too, in the
 * catalogue and on "My learning" alike, under a progress bar that counts the whole course.
 */
beforeAll(async () => {
  await i18nReady;
});

const card = (overrides: Partial<CourseCardProps> = {}): CourseCardProps => ({
  variant: 'my-learning',
  id: 'course-1',
  title: 'Deutsch A1',
  category: 'Language',
  levelLabel: 'A1',
  imageUrl: '',
  description: '',
  price: '100',
  lessonsCount: 111,
  durationHours: 12,
  isPublished: true,
  ...overrides,
});

const Where = () => <span data-testid="where">{useLocation().pathname}</span>;

const renderCard = (props: CourseCardProps, signedIn = false) =>
  renderWithProviders(
    <ModalProvider>
      <CourseCard {...props} />
      <Where />
    </ModalProvider>,
    signedIn
      ? {
          preloadedState: {
            auth: { isAuthenticated: true, status: 'idle', error: null },
          } as never,
        }
      : undefined,
  );

describe('a course the student has not bought', () => {
  it('shows the price and both buttons on "My learning"', async () => {
    renderCard(card({ accessIsTrial: true }));

    expect(await screen.findByText('Спробувати')).toBeInTheDocument();
    expect(screen.getByText('Купити')).toBeInTheDocument();
    expect(screen.getByText('€100.00')).toBeInTheDocument();
  });

  /** The bar is the argument: "25 of 111" sitting directly above "buy". */
  it('keeps the progress bar on "My learning"', async () => {
    renderCard(
      card({ accessIsTrial: true, progress: { percent: 23, completed: 25, total: 111 } }),
    );

    expect(await screen.findByText('Пройдено 25 з 111')).toBeInTheDocument();
    expect(screen.getByText('Спробувати')).toBeInTheDocument();
  });

  it('does not say it is being carried on', async () => {
    renderCard(card({ accessIsTrial: true }));

    await screen.findByText('Спробувати');
    expect(screen.queryByText('Продовжити навчання')).not.toBeInTheDocument();
  });

  it('shows the same panel in the catalogue', async () => {
    renderCard(card({ variant: 'catalog', isAdded: true, accessIsTrial: true }));

    expect(await screen.findByText('Спробувати')).toBeInTheDocument();
    expect(screen.getByText('Купити')).toBeInTheDocument();
    expect(screen.queryByText('Продовжити навчання')).not.toBeInTheDocument();
  });
});

describe('a course the student bought', () => {
  it('simply carries on, on "My learning"', async () => {
    renderCard(card({ accessIsTrial: false }));

    expect(await screen.findByText('Продовжити навчання')).toBeInTheDocument();
    expect(screen.queryByText('Купити')).not.toBeInTheDocument();
  });

  it('simply carries on, in the catalogue', async () => {
    renderCard(card({ variant: 'catalog', isAdded: true, accessIsTrial: false }));

    expect(await screen.findByText('Продовжити навчання')).toBeInTheDocument();
    expect(screen.queryByText('Купити')).not.toBeInTheDocument();
  });
});

describe('pressing "try" on a course whose free part is already open', () => {
  /** Opening the course prefetches its tree; without this the stray request fails the run. */
  beforeEach(() => {
    server.use(
      http.get(`${TEST_API_BASE_URL}/courses/course-1`, () =>
        HttpResponse.json({ id: 'course-1', title: 'Deutsch A1', modules: [] }),
      ),
    );
  });

  /**
   * The trap this design walks into. `POST /courses/:id/start-trial` answers 409 Conflict
   * when an access row already exists, and `requestCourseTrial` reads any failure as a
   * dead end and navigates to the catalogue - so the button would bounce the student off
   * the page they were on, for exactly the people it is now shown to.
   */
  it('does not ask the server to start a trial that exists', async () => {
    let startTrialCalls = 0;
    server.use(
      http.post(`${TEST_API_BASE_URL}/courses/course-1/start-trial`, () => {
        startTrialCalls += 1;
        return HttpResponse.json(
          { message: 'У вас вже є доступ до цього курсу' },
          { status: 409 },
        );
      }),
    );

    renderCard(card({ accessIsTrial: true }));
    await userEvent.click(await screen.findByText('Спробувати'));

    await waitFor(() => expect(screen.getByTestId('where')).toHaveTextContent('/courses/course-1'));
    expect(startTrialCalls).toBe(0);
  });

  /** Where it goes matters as much: into the course, not back to the catalogue. */
  it('opens the course rather than the catalogue', async () => {
    renderCard(card({ accessIsTrial: true }));
    await userEvent.click(await screen.findByText('Спробувати'));

    await waitFor(() =>
      expect(screen.getByTestId('where')).toHaveTextContent('/courses/course-1'),
    );
  });

  /** A student with no access at all still goes through the server, as before. */
  it('still starts a trial for a student who has none', async () => {
    let startTrialCalls = 0;
    server.use(
      http.post(`${TEST_API_BASE_URL}/courses/course-1/start-trial`, () => {
        startTrialCalls += 1;
        return HttpResponse.json({ course_id: 'course-1', access_type: 'trial' });
      }),
      http.get(`${TEST_API_BASE_URL}/courses`, () => HttpResponse.json([])),
    );

    renderCard(card({ variant: 'catalog', accessIsTrial: false }), true);
    await userEvent.click(await screen.findByText('Спробувати'));

    await waitFor(() => expect(startTrialCalls).toBe(1));
  });
});

describe('what the server says about access', () => {
  /**
   * `trialOnOffer` is the other question - whether this course offers a trial at all -
   * and the two shared the name `hasTrial` until now. It meant "a trial is on offer" in
   * the catalogue and "the access I have is a trial" on My learning, and `CourseCard`
   * read the one while `mapApiCourseToCourseInfo` wrote the other.
   */
  it('marks a trial as a trial on both mappers', () => {
    const row = { id: 'course-1', title: 'Deutsch A1', my_access: { access_type: 'trial' } };

    expect(mapApiCourseToCourseInfo(row as never).accessIsTrial).toBe(true);
    expect(mapApiCourseToCourseCard(row as never).accessIsTrial).toBe(true);
  });

  it('does not mark a bought course as one', () => {
    const row = { id: 'course-1', title: 'Deutsch A1', my_access: { access_type: 'purchase' } };

    expect(mapApiCourseToCourseInfo(row as never).accessIsTrial).toBe(false);
    expect(mapApiCourseToCourseCard(row as never).accessIsTrial).toBe(false);
  });

  /** The public catalogue carries no `my_access` at all, and that is not a trial. */
  it('does not invent a trial from a response that says nothing', () => {
    const row = { id: 'course-1', title: 'Deutsch A1' };

    expect(mapApiCourseToCourseCard(row as never).accessIsTrial).toBe(false);
  });
});

describe('which kind of access one course is held under', () => {
  it('tells a trial from a purchase', () => {
    expect(courseAccessKind([{ course_id: 'c1', access_type: 'trial' }], 'c1')).toBe('trial');
    expect(courseAccessKind([{ course_id: 'c1', access_type: 'purchase' }], 'c1')).toBe('full');
    expect(courseAccessKind([{ course_id: 'c1', access_type: 'subscription' }], 'c1')).toBe(
      'full',
    );
  });

  it('answers none for a course that is not in the list', () => {
    expect(courseAccessKind([{ course_id: 'c2', access_type: 'purchase' }], 'c1')).toBe('none');
    expect(courseAccessKind([], 'c1')).toBe('none');
  });

  /**
   * A student who starts a trial and then buys holds both rows. Reading them in list order
   * would let whichever came back first decide, and half the time that is the trial - which
   * would take "Продовжити навчання" away from someone who had just paid.
   */
  it('lets a purchase settle it whichever way round the rows arrive', () => {
    const trialFirst = [
      { course_id: 'c1', access_type: 'trial' },
      { course_id: 'c1', access_type: 'purchase' },
    ];

    expect(courseAccessKind(trialFirst, 'c1')).toBe('full');
    expect(courseAccessKind([...trialFirst].reverse(), 'c1')).toBe('full');
  });

  it('ignores rubbish in the list rather than throwing', () => {
    expect(courseAccessKind([null, 'x', 7, {}, { course_id: 'c1' }] as never, 'c1')).toBe('none');
  });
});
