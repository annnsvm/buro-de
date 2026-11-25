import { renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { courseFormFields } from '@/features/course-managment/domain/courseFormFields';
import { mapCourseToForm } from '@/features/course-managment/domain/mapCourseToForm';
import CourseDurationSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseDurationSection';
import { renderWithProviders } from '../../../utils/renderWithProviders';
import type { CreateCourseFormValues } from '@/features/course-managment/validation/createCourseSchema';

/**
 * How long a course is, and who gets the last word on it.
 *
 * The figure is normally arithmetic: the editor adds up every video and saves the total
 * whenever the structure changes - and on merely opening the course, because it syncs on
 * load. Nobody maintains it, and it is right nearly always.
 *
 * It is wrong where a sum cannot see the work. A course whose weight is in the writing
 * tasks is not as short as its videos; one still being filmed is not as short as what has
 * been uploaded. So the author can take the number over - and the sum has to stand down
 * when they do, or the next thing they touch in the course puts the arithmetic back
 * without a word.
 */
const patchCourse = vi.fn();
vi.mock('@/api/courseManagementApi', () => ({
  patchCourse: (...a: unknown[]) => patchCourse(...a),
  fetchCourseById: vi.fn(),
}));

const { useCourseEditorTree } = await import(
  '@/features/course-managment/course-editor/hooks/tree/useCourseEditorTree'
);

const form = (overrides: Partial<CreateCourseFormValues> = {}): CreateCourseFormValues =>
  ({
    title: 'Deutsch A1',
    description: '',
    language: 'de',
    category: 'language',
    price: '100',
    durationHours: '',
    durationHoursManual: false,
    level: 'A1',
    levelTo: '',
    trialModuleCount: '2',
    isIntegration: false,
    ...overrides,
  }) as CreateCourseFormValues;

/** One module with a single video of two hours and ten minutes. */
const modulesWithVideo = [
  {
    id: 'm1',
    title: 'Модуль 1',
    orderIndex: 0,
    materials: [
      { id: 'v1', title: 'Урок', type: 'video', orderIndex: 0, content: { duration: '130:00' } },
    ],
  },
] as never;

beforeEach(() => {
  vi.clearAllMocks();
  patchCourse.mockResolvedValue({ data: {} });
});

describe('what the form sends', () => {
  /** Always, so "go back to working it out" is sendable and not merely omittable. */
  it('always says which way the duration is decided', () => {
    expect(courseFormFields(form())).toMatchObject({ duration_hours_manual: false });
    expect(courseFormFields(form({ durationHoursManual: true }))).toMatchObject({
      duration_hours_manual: true,
    });
  });

  /**
   * On automatic the figure belongs to the running sum. Sending the form's copy of it as
   * well would be two writers for one number, and the form's copy is the older of the two.
   */
  it('leaves the hours alone while the sum owns them', () => {
    const sent = courseFormFields(form({ durationHours: '9' }));

    expect(sent).not.toHaveProperty('duration_hours');
  });

  it('sends the hours once the author owns them', () => {
    const sent = courseFormFields(form({ durationHours: '9', durationHoursManual: true }));

    expect(sent).toMatchObject({ duration_hours: 9 });
  });
});

describe('reading a saved course back', () => {
  it('remembers that the author set the figure', () => {
    const values = mapCourseToForm({
      title: 'Deutsch A1',
      durationHours: 9,
      durationHoursManual: true,
    } as never);

    expect(values).toMatchObject({ durationHours: '9', durationHoursManual: true });
  });

  it('treats a course that never said so as automatic', () => {
    const values = mapCourseToForm({ title: 'Deutsch A1', durationHours: 9 } as never);

    expect(values).toMatchObject({ durationHoursManual: false });
  });
});

describe('the automatic sum', () => {
  it('saves the total it worked out from the videos', async () => {
    const { result } = renderHook(() =>
      useCourseEditorTree({
        setValue: vi.fn(),
        setModules: vi.fn(),
        setIsCoursePublished: vi.fn(),
        getIsDurationManual: () => false,
      }),
    );

    await result.current.syncCourseDurationHours('course-1', modulesWithVideo);

    /** Two hours ten minutes, rounded up to whole hours as the catalogue shows them. */
    expect(patchCourse).toHaveBeenCalledWith('course-1', { duration_hours: 3 });
  });

  /**
   * The regression this guards. The sync runs on opening the course, so without this a
   * figure typed on purpose would be gone by the next time the author looked at it.
   */
  it('stands down once the author has set the figure', async () => {
    const setValue = vi.fn();
    const { result } = renderHook(() =>
      useCourseEditorTree({
        setValue,
        setModules: vi.fn(),
        setIsCoursePublished: vi.fn(),
        getIsDurationManual: () => true,
      }),
    );

    await result.current.syncCourseDurationHours('course-1', modulesWithVideo);

    expect(patchCourse).not.toHaveBeenCalled();
    /** And does not quietly change the number on screen either. */
    expect(setValue).not.toHaveBeenCalled();
  });
});

describe('the duration tile', () => {
  const draw = (props: Partial<React.ComponentProps<typeof CourseDurationSection>> = {}) =>
    renderWithProviders(
      <CourseDurationSection
        durationMinutes={130}
        videoLessonsCount={4}
        manual={false}
        hours=""
        onHoursChange={vi.fn()}
        onManualChange={vi.fn()}
        {...props}
      />,
    );

  it('shows the sum while it is doing the counting', () => {
    draw();

    expect(screen.getByTestId('course-duration-computed')).toHaveTextContent('2 год 10 хв');
    expect(screen.getByText(/Рахується з відео уроків/)).toBeInTheDocument();
  });

  it('offers a field once the author takes it over', () => {
    draw({ manual: true, hours: '3' });

    expect(screen.getByLabelText('Тривалість курсу в годинах')).toHaveValue('3');
    expect(screen.getByText(/Виставлено вручну/)).toBeInTheDocument();
  });

  /** Nearly always the author is adjusting the sum, not replacing it from nothing. */
  it('starts from the figure already on screen', async () => {
    const onHoursChange = vi.fn();
    const onManualChange = vi.fn();
    draw({ onHoursChange, onManualChange });

    await userEvent.click(screen.getByRole('button', { name: 'Виставити вручну' }));

    expect(onHoursChange).toHaveBeenCalledWith('3');
    expect(onManualChange).toHaveBeenCalledWith(true);
  });

  it('hands it back to the arithmetic', async () => {
    const onManualChange = vi.fn();
    draw({ manual: true, hours: '9', onManualChange });

    await userEvent.click(screen.getByRole('button', { name: 'Рахувати автоматично' }));

    expect(onManualChange).toHaveBeenCalledWith(false);
  });
});
