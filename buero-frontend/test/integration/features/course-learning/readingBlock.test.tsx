import { beforeAll, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReadingText from '@/features/course-learning/QuizPanel/ReadingText';
import type { PracticeElement } from '@/api/quizApi';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The text a reading block's questions are about.
 *
 * Two things have to survive any amount of restyling: the text stays on screen while the
 * questions are answered, and the whole of what the author wrote is still there. A reading
 * task whose text scrolls away is a memory test, and a line of it lost to a parser is a
 * question the student cannot answer.
 */
beforeAll(async () => {
  await i18nReady;
});

const BODY = [
  'Lesepaten in der Stadtbibliothek',
  '',
  'Jeden Mittwoch kommen zwanzig Kinder in die Stadtbibliothek.',
  '',
  'Слова: der Lesepate, -n — читальний наставник · das Fest — свято',
].join('\n');

const element = (over: Partial<PracticeElement> = {}): PracticeElement => ({
  id: 'lt1',
  kind: 'text',
  title: 'Оголошення бібліотеки',
  body: BODY,
  audio_url: null,
  awaiting_audio: false,
  has_transcript: false,
  transcript: null,
  ...over,
});

describe('a reading text', () => {
  it('is named on its tab', async () => {
    renderWithProviders(<ReadingText element={element()} />);

    expect(screen.getByText('Оголошення бібліотеки')).toBeInTheDocument();
  });

  it('shows the German, without the word list running into it', async () => {
    renderWithProviders(<ReadingText element={element()} />);

    const text = screen.getByText(/Jeden Mittwoch kommen zwanzig Kinder/);
    expect(text).toBeInTheDocument();
    expect(text.textContent).not.toContain('Слова:');
  });

  it('sets the words out as their own list', async () => {
    renderWithProviders(<ReadingText element={element()} />);

    expect(screen.getByText('Слова')).toBeInTheDocument();
    expect(screen.getByText('der Lesepate, -n')).toBeInTheDocument();
    expect(screen.getByText('das Fest')).toBeInTheDocument();
  });

  /**
   * Stays put while the questions are answered. Dropped, the student would be scrolling back
   * up for every one of eight questions.
   */
  it('stays on screen as the questions are answered', async () => {
    const { container } = renderWithProviders(<ReadingText element={element()} />);

    expect(container.querySelector('section')?.className).toContain('sticky');
  });

  it('folds away and comes back', async () => {
    renderWithProviders(<ReadingText element={element()} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /Згорнути текст/ }));
    expect(
      screen.queryByText(/Jeden Mittwoch kommen zwanzig Kinder/),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Показати текст/ }));
    expect(
      screen.getByText(/Jeden Mittwoch kommen zwanzig Kinder/),
    ).toBeInTheDocument();
  });

  /** A text with no list of hers shows no empty heading where one would have been. */
  it('shows no word list when the author wrote none', async () => {
    renderWithProviders(
      <ReadingText element={element({ body: 'Hallo Nina,\n\nwie geht es dir?' })} />,
    );

    expect(screen.getByText(/wie geht es dir/)).toBeInTheDocument();
    expect(screen.queryByText('Слова')).not.toBeInTheDocument();
  });
});
