import { describe, expect, it } from 'vitest';

import GapPrompt from '@/features/course-learning/PracticePanel/ui/GapPrompt';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * The gap in a fill-in question, drawn as somewhere to write.
 *
 * The author types it as "___" because that is what a spreadsheet can hold. Drawn as a
 * floating bar it read as a dash - "Ich danke - Mutter" is a sentence with a dash in it, not
 * a sentence with a blank. It belongs on the line, where an underscore would be.
 */
describe('the gap in a question', () => {
  const gaps = (container: HTMLElement) =>
    container.querySelectorAll('span[aria-hidden]');

  it('draws a run of underscores as a blank', () => {
    const { container } = renderWithProviders(
      <GapPrompt text="Ich danke ___ Mutter." />,
    );

    expect(gaps(container)).toHaveLength(1);
    /** The author's words either side of it, unchanged. */
    expect(container.textContent).toContain('Ich danke');
    expect(container.textContent).toContain('Mutter.');
  });

  /** It sits on the text's own line rather than floating in the middle of it. */
  it('rules the line under the blank instead of through it', () => {
    const { container } = renderWithProviders(
      <GapPrompt text="Ich danke ___ Mutter." />,
    );

    const gap = gaps(container)[0];
    expect(gap.className).toContain('border-b-2');
    expect(gap.className).not.toContain('bg-[var(--color-accent-primary)]');
  });

  it('leaves a question with no gap exactly as it is', () => {
    const { container } = renderWithProviders(
      <GapPrompt text="Яке речення правильне?" />,
    );

    expect(container.textContent).toBe('Яке речення правильне?');
    expect(gaps(container)).toHaveLength(0);
  });

  /** A single underscore belongs to the text, not to a gap. */
  it('leaves one underscore alone', () => {
    const { container } = renderWithProviders(<GapPrompt text="snake_case" />);

    expect(container.textContent).toBe('snake_case');
  });

  it('draws every gap in a question that has two', () => {
    const { container } = renderWithProviders(
      <GapPrompt text="Ich komme ___ der Ukraine und wohne hier ___ einem Jahr." />,
    );

    expect(gaps(container)).toHaveLength(2);
  });
});
