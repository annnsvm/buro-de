import { describe, expect, it, beforeAll } from 'vitest';
import { screen } from '@testing-library/react';

import CourseStructure from '@/features/courses-catalog/CourseStructure';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * How the modules of a course are numbered in the lesson list.
 *
 * Every course opens with module 0 - the introduction that explains how to study - and
 * module 1 is the first one that teaches. Counting the list from one put "МОДУЛЬ 1" above a
 * module the author had named "Module 0", so the two numbers on the same row disagreed.
 *
 * The author's own title is separate and may say anything; only the small label above it is
 * ours to number.
 */
beforeAll(async () => {
  await i18nReady;
});

const module_ = (id: string, title: string) => ({
  id,
  title,
  orderIndex: Number(id),
  materials: [{ id: `${id}-m`, title: 'Lektion', type: 'video' }],
});

describe('numbering the modules of a course', () => {
  it('calls the first module zero, not one', async () => {
    renderWithProviders(
      <CourseStructure
        modules={[module_('0', 'Module 0'), module_('1', 'Module 1')] as never}
      />,
    );

    expect(await screen.findByText(/МОДУЛЬ\s*0/i)).toBeInTheDocument();
    expect(screen.getByText(/МОДУЛЬ\s*1/i)).toBeInTheDocument();
  });

  /** The author's title is hers; it is shown as written and never renumbered. */
  it('shows the author’s own title untouched beside it', async () => {
    renderWithProviders(
      <CourseStructure modules={[module_('0', 'Вступ до курсу')] as never} />,
    );

    expect(await screen.findByText('Вступ до курсу')).toBeInTheDocument();
  });
});
