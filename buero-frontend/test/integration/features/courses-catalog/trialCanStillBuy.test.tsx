import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { beforeAll, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';

import CourseInfoModal from '@/features/courses-catalog/CourseInfoModal';
import ModalProvider from '@/components/modal/context/ModalProvider';
import { i18nReady } from '@/i18n';
import type { CourseInfoData } from '@/types/components/modal/UIModalType.types';

import { TEST_API_BASE_URL } from '../../../constants';
import { server } from '../../../mocks/server';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The course modal is the one screen where a course is actually sold, and it was shut to
 * exactly the people most likely to buy.
 *
 * It asked `userHasAccessToCourse` - whether there is any access at all - and a trial
 * answers yes. So a student who had opened the free part was handed the buyer's panel:
 * "Продовжити навчання" alone, the checkout button gone. Nothing anywhere in the
 * catalogue or on "My learning" would sell them the course after that; the only remaining
 * way to pay was to open the course and find the blurred tail of the lesson sidebar.
 *
 * A trial is an unbought course, so it now gets the unbought course's panel - the price,
 * "buy" and "try" - and only a purchase turns it into "continue learning".
 */
beforeAll(async () => {
  await i18nReady;
});

const COURSE_ID = 'course-1';

const course: CourseInfoData = {
  id: COURSE_ID,
  title: 'Deutsch A1',
  category: 'Language',
  levelLabel: 'A1',
  imageUrl: '',
  description: '',
  price: '100',
  lessonsCount: 111,
  durationHours: 12,
  isPublished: true,
};

const Where = () => <span data-testid="where">{useLocation().pathname}</span>;

const openModalFor = (accessRows: unknown[]) => {
  server.use(
    http.get(`${TEST_API_BASE_URL}/subscriptions/me`, () => HttpResponse.json(accessRows)),
    http.get(`${TEST_API_BASE_URL}/courses/${COURSE_ID}`, () =>
      HttpResponse.json({
        id: COURSE_ID,
        title: 'Deutsch A1',
        /**
         * What the server really sends: every module, with `content` and attachments
         * stripped from the locked ones and their titles and durations kept.
         */
        my_access: accessRows.length
          ? {
              access_type: (accessRows[0] as { access_type: string }).access_type,
              trial_module_ids: ['m1', 'm2'],
              first_module_id: 'm1',
            }
          : undefined,
        modules: [
          { id: 'm1', title: 'Знайомство', locked: false, materials: [{ id: 'x1', title: 'Урок 1', type: 'video' }] },
          { id: 'm2', title: 'Числа', locked: false, materials: [{ id: 'x2', title: 'Урок 2', type: 'video' }] },
          { id: 'm3', title: 'Робота', locked: true, materials: [{ id: 'x3', title: 'Урок 3', type: 'video' }] },
          { id: 'm4', title: 'Житло', locked: true, materials: [{ id: 'x4', title: 'Урок 4', type: 'video' }] },
        ],
      }),
    ),
    /** Asked for by the workspace prefetch the modal fires once access is known. */
    http.get(`${TEST_API_BASE_URL}/courses/${COURSE_ID}/progress`, () =>
      HttpResponse.json({ completed_material_ids: [] }),
    ),
  );

  return renderWithProviders(
    <ModalProvider>
      <CourseInfoModal
        isOpen
        handleOpenChange={() => undefined}
        courseId={COURSE_ID}
        course={course}
      />
      <Where />
    </ModalProvider>,
    {
      preloadedState: {
        auth: { isAuthenticated: true, status: 'idle', error: null },
        user: {
          currentUser: {
            id: 's1',
            email: 'student@example.com',
            name: 'Student',
            role: 'student',
            language: 'uk',
          },
          status: 'idle',
          error: null,
        },
      } as never,
    },
  );
};

describe('the course modal for a student on a trial', () => {
  it('still offers the course for sale', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'trial' }]);

    expect(await screen.findByText('Купити курс')).toBeInTheDocument();
  });

  /** What is already theirs stays reachable - through the same button as before. */
  it('offers the free part beside it', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'trial' }]);

    expect(await screen.findByText('Спробувати безкоштовно')).toBeInTheDocument();
  });

  it('does not say the course is being carried on', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'trial' }]);

    await screen.findByText('Купити курс');
    expect(screen.queryByText('Продовжити навчання')).not.toBeInTheDocument();
  });

  /** The line under the buttons used to be hidden by "has any access at all". */
  it('says what the free part covers', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'trial' }]);

    expect(
      await screen.findByText('Перший модуль відкритий безкоштовно.'),
    ).toBeInTheDocument();
  });

  /**
   * And "try" must not ask the server to start a trial that exists: `POST /start-trial`
   * answers 409 on an existing access row, and `requestCourseTrial` reads any failure as
   * a dead end and navigates to the catalogue - closing the modal onto the wrong page.
   */
  it('opens the free part rather than starting the trial again', async () => {
    let startTrialCalls = 0;
    server.use(
      http.post(`${TEST_API_BASE_URL}/courses/${COURSE_ID}/start-trial`, () => {
        startTrialCalls += 1;
        return HttpResponse.json({ message: 'already' }, { status: 409 });
      }),
    );

    openModalFor([{ course_id: COURSE_ID, access_type: 'trial' }]);
    await userEvent.click(await screen.findByText('Спробувати безкоштовно'));

    await waitFor(() =>
      expect(screen.getByTestId('where')).toHaveTextContent(`/courses/${COURSE_ID}`),
    );
    expect(startTrialCalls).toBe(0);
  });
});

describe('the course modal for a student who bought the course', () => {
  it('carries on, and offers nothing to buy', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'purchase' }]);

    expect(await screen.findByText('Продовжити навчання')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Купити курс')).not.toBeInTheDocument());
    expect(screen.queryByText('Спробувати безкоштовно')).not.toBeInTheDocument();
  });
});

describe('the course modal for a student with no access', () => {
  it('offers the purchase and the trial, as before', async () => {
    openModalFor([]);

    expect(await screen.findByText('Купити курс')).toBeInTheDocument();
    expect(screen.getByText('Спробувати безкоштовно')).toBeInTheDocument();
  });
});

/**
 * The programme on this screen is a course description, not paid content. It used to be
 * put through `applyTrialModuleScope`, which cuts it to the modules a trial opens - so a
 * student who had started the free part saw two modules where a stranger with no account
 * saw the whole course. The one closest to buying was shown the least of it.
 */
describe('the programme in the course modal', () => {
  it('shows every module to a student on a trial', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'trial' }]);

    expect(await screen.findByText('Робота')).toBeInTheDocument();
    expect(screen.getByText('Житло')).toBeInTheDocument();
    expect(screen.getByText('Знайомство')).toBeInTheDocument();
  });

  it('shows every module to someone with no access at all', async () => {
    openModalFor([]);

    expect(await screen.findByText('Робота')).toBeInTheDocument();
    expect(screen.getByText('Житло')).toBeInTheDocument();
  });

  it('shows every module to someone who bought the course', async () => {
    openModalFor([{ course_id: COURSE_ID, access_type: 'purchase' }]);

    expect(await screen.findByText('Робота')).toBeInTheDocument();
    expect(screen.getByText('Житло')).toBeInTheDocument();
  });
});
