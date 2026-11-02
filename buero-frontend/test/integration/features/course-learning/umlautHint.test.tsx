import { beforeAll, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';

import WrittenExercise from '@/features/course-learning/exercises/WrittenExercise';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Writing German on a Ukrainian keyboard.
 *
 * There is nothing to press: the server accepts ae/oe/ue/ss, so the whole answer is one line
 * of text saying so. Buttons for ä ö ü ß were tried and taken out again - they were four more
 * things to look at for a problem a sentence already solves.
 */
beforeAll(async () => {
  await i18nReady;
});

const question = {
  id: 'q1',
  type: 'fill_blank' as const,
  prompt: 'Ich danke ___ Mutter.',
  points: 1,
  element_id: null,
  order_index: 0,
};

describe('typing an answer with no German keyboard', () => {
  const draw = () =>
    renderWithProviders(
      <WrittenExercise
        question={question}
        answer=""
        onChange={vi.fn()}
        disabled={false}
      />,
    );

  it('says the spellings that are accepted', async () => {
    draw();

    expect(
      screen.getByText('Умляути можна писати як ae, oe, ue, ss'),
    ).toBeInTheDocument();
  });

  /** The hint is true: the server folds ae/oe/ue/ss before it compares. */
  it('offers no keys to press instead', async () => {
    draw();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('leaves one box to type into', async () => {
    draw();

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
