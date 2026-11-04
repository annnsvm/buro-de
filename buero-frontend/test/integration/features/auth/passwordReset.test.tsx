import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Getting back in after forgetting the password.
 *
 * Until this existed there was no way back at all: a student who had paid for a course and
 * lost their password could only be let in by hand, from the database.
 *
 * The screen has one rule it must not break. The server answers a request for a code the
 * same way whether or not the address has an account - otherwise this pair of endpoints
 * becomes a way of finding out who has bought the course - and the screen has to keep that
 * promise too. It may say the code is on its way *if* the account exists; it may never say
 * it was sent to this person.
 */
vi.mock('@/api/passwordResetApi', () => ({
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

const api = await import('@/api/passwordResetApi');
const ResetPasswordModalPanel = (
  await import('@/features/auth/components/ResetPasswordModalPanel')
).default;

beforeAll(async () => {
  await i18nReady;
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(api.requestPasswordReset).mockResolvedValue(undefined);
  vi.mocked(api.resetPassword).mockResolvedValue(undefined);
});

/** The panel's header is a Radix dialog title, so it needs the dialog it lives in. */
const draw = (prefillEmail?: string) =>
  renderWithProviders(
    <BaseDialog isOpen handleOpenChange={vi.fn()}>
      <ResetPasswordModalPanel prefillEmail={prefillEmail} onDismiss={vi.fn()} />
    </BaseDialog>,
  );

describe('asking for a code', () => {
  it('carries the address already typed into the login box', async () => {
    draw('anna@example.com');

    expect(await screen.findByDisplayValue('anna@example.com')).toBeInTheDocument();
  });

  it('asks the server for a code', async () => {
    draw('anna@example.com');

    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));

    expect(api.requestPasswordReset).toHaveBeenCalledWith('anna@example.com', 'uk');
  });

  /**
   * The promise the server makes, kept on screen. "We sent you a code" would confirm the
   * address belongs to somebody.
   */
  it('says the code is coming only if the account exists', async () => {
    draw('anna@example.com');

    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));

    expect(
      await screen.findByText(/Якщо акаунт із такою поштою існує/),
    ).toBeInTheDocument();
  });

  it('will not send an empty address', async () => {
    draw();

    expect(await screen.findByRole('button', { name: 'Надіслати код' })).toBeDisabled();
  });
});

describe('using the code', () => {
  const reachStepTwo = async () => {
    draw('anna@example.com');
    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));
    return screen.findByPlaceholderText('Код із листа');
  };

  it('sends the code and the new password together', async () => {
    const codeField = await reachStepTwo();
    await userEvent.type(codeField, '482915');
    await userEvent.type(screen.getByPlaceholderText('Новий пароль'), 'NewSecure2');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти новий пароль' }));

    expect(api.resetPassword).toHaveBeenCalledWith(
      'anna@example.com',
      '482915',
      'NewSecure2',
    );
  });

  /** The rule is the server's; saying it first saves a round trip and a refusal. */
  it('says what the password has to be before it is typed', async () => {
    await reachStepTwo();

    expect(
      screen.getByText(/Щонайменше 9 символів, одна велика літера й одна цифра/),
    ).toBeInTheDocument();
  });

  it('shows what the server said when the code is refused', async () => {
    vi.mocked(api.resetPassword).mockRejectedValue(
      new Error('Невірний або прострочений код'),
    );

    const codeField = await reachStepTwo();
    await userEvent.type(codeField, '000000');
    await userEvent.type(screen.getByPlaceholderText('Новий пароль'), 'NewSecure2');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти новий пароль' }));

    expect(await screen.findByText(/Невірний або прострочений код/)).toBeInTheDocument();
  });

  /** A mistyped address is the likeliest reason no code arrived. */
  it('can go back to correct the address', async () => {
    await reachStepTwo();

    await userEvent.click(screen.getByRole('button', { name: /Вказали не ту пошту/ }));

    expect(
      await screen.findByRole('button', { name: 'Надіслати код' }),
    ).toBeInTheDocument();
  });

  /**
   * Every session was signed out by the server, including any the student still had, so
   * the only way on is the front door - and the screen says so rather than leaving them
   * on a dead panel.
   */
  it('sends them to the login once the password is set', async () => {
    const codeField = await reachStepTwo();
    await userEvent.type(codeField, '482915');
    await userEvent.type(screen.getByPlaceholderText('Новий пароль'), 'NewSecure2');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти новий пароль' }));

    expect(await screen.findByText('Пароль змінено')).toBeInTheDocument();
    expect(screen.getByText(/Усі попередні сеанси завершено/)).toBeInTheDocument();
  });
});
