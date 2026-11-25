import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FormField from '@/components/ui/FormField/FormField';

/**
 * Where a field's error message is allowed to go.
 *
 * It used to be positioned absolutely - `absolute -bottom-1` - which pinned its bottom edge
 * just under the field and made it grow upwards. That held for exactly as long as every
 * message fitted on one line. When the auth wordings were translated, the Ukrainian ones
 * ran longer than the English they replaced, wrapped to two lines, and the second line
 * climbed over the input and sat on top of what was being typed.
 *
 * jsdom has no layout, so none of this can be measured here. What can be checked is the
 * property that caused it: a message taken out of the normal flow has nowhere to grow but
 * over its own field, so it must stay in the flow.
 */
const draw = (error?: string) =>
  render(
    <FormField name="login-password" error={error}>
      <input id="login-password" />
    </FormField>,
  );

describe('a field that has something to say', () => {
  it('shows the message', () => {
    draw('Пароль: щонайменше 9 символів, одна велика літера й одна цифра.');

    expect(screen.getByRole('alert')).toHaveTextContent('щонайменше 9 символів');
  });

  /**
   * The regression. Out of the flow, the message cannot push anything down, so a second
   * line has to go somewhere - and the only way is up, over the input.
   */
  it('keeps the message in the flow, so a second line pushes down and not up', () => {
    draw('A message long enough to wrap onto a second line on a narrow dialog.');

    expect(screen.getByRole('alert').className).not.toContain('absolute');
  });

  it('puts the message after the field, not before it', () => {
    const { container } = draw('Невірний пароль.');
    const field = container.querySelector('#login-password');
    const message = screen.getByRole('alert');

    expect(field?.compareDocumentPosition(message)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('names the message so the field can point at it', () => {
    draw('Невірний пароль.');

    expect(screen.getByRole('alert')).toHaveAttribute('id', 'login-password-error');
  });
});

describe('a field with nothing to say', () => {
  /**
   * The one thing the absolute positioning was genuinely for. Without space held open, a
   * form jolts downwards the moment a message appears and back up when it goes - which is
   * worst exactly when someone is correcting a password and watching the field.
   */
  it('still keeps the space, so the form does not jump when a message arrives', () => {
    const { container } = draw(undefined);
    const reserved = container.querySelector('p');

    expect(reserved).not.toBeNull();
    expect(reserved?.className).toContain('min-h-5');
  });

  it('raises no alert and claims no id when there is no error', () => {
    const { container } = draw(undefined);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(container.querySelector('#login-password-error')).toBeNull();
  });
});
