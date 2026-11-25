import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';

import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Getting back in after forgetting the password.
 *
 * Until this existed there was no way back at all: a student who had paid for a course and
 * lost their password could only be let in by hand, from the database.
 *
 * What is tested here is how it fails. The server used to answer a request for a code the
 * same way whichever way it went, so that the endpoint could not be used to learn who had
 * bought the course - and this screen had to keep that vagueness, saying a code was on its
 * way *if* the account existed and then waiting for digits that might never come. The
 * secrecy protected nothing (`POST /auth/register` answers the same question openly with a
 * 409) and cost the student who had simply mistyped their address.
 *
 * So each failure is named now, and each is checked here for the thing it should offer:
 * an address with no account gets the sign-up button, a code past its fifteen minutes gets
 * the button that asks for a new one, and a second ask inside the cooldown goes on to the
 * step that uses the code already in the inbox.
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

/**
 * What `apiInstance` rejects with: an axios error carrying the server's body, which is
 * where `authFailure` reads the code from. Built rather than hand-written so that the
 * `isAxiosError` branch is the one actually exercised.
 */
const refusal = (status: number, code?: string) =>
  new AxiosError('refused', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    data: code ? { statusCode: status, code } : { statusCode: status },
    headers: {},
    config: { headers: {} } as never,
  });

/** No answer at all, so there is no status to read a meaning off. */
const unreachable = () => new AxiosError('Network Error', 'ERR_NETWORK');

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

  /** It can name the inbox now, because an address with no account is refused outright. */
  it('names the address the code went to', async () => {
    draw('anna@example.com');

    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));

    expect(
      await screen.findByText(/Код надіслано на anna@example\.com/),
    ).toBeInTheDocument();
  });

  /**
   * The case the old silence was worst for: the student is watching an inbox that will
   * never get anything, and the only thing that helps is the screen that makes an account.
   */
  it('says there is no such account, and offers to make one', async () => {
    vi.mocked(api.requestPasswordReset).mockRejectedValue(
      refusal(404, 'ACCOUNT_NOT_FOUND'),
    );
    draw('anna@example.com');

    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));

    expect(await screen.findByText(/Акаунта з такою поштою немає/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Зареєструватися з цією поштою/ }),
    ).toBeInTheDocument();
    /** And it stays put: there is no code to go and type. */
    expect(screen.queryByPlaceholderText('Код із листа')).not.toBeInTheDocument();
  });

  /**
   * Nothing new was sent, but a code from a minute ago is sitting in the inbox - so the
   * step that takes it is where the student needs to be, not the one they are on.
   */
  it('goes on to the code when one was already sent a moment ago', async () => {
    vi.mocked(api.requestPasswordReset).mockRejectedValue(
      refusal(400, 'CODE_TOO_SOON'),
    );
    draw('anna@example.com');

    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));

    expect(await screen.findByPlaceholderText('Код із листа')).toBeInTheDocument();
    expect(screen.getByText(/менш як хвилину тому/)).toBeInTheDocument();
  });

  /** No status to read, so nothing about the account can be concluded or claimed. */
  it('says the server could not be reached', async () => {
    vi.mocked(api.requestPasswordReset).mockRejectedValue(unreachable());
    draw('anna@example.com');

    await userEvent.click(await screen.findByRole('button', { name: 'Надіслати код' }));

    expect(await screen.findByText(/Немає зв'язку з сервером/)).toBeInTheDocument();
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

  const submitCode = async (digits: string) => {
    const codeField = await reachStepTwo();
    await userEvent.type(codeField, digits);
    await userEvent.type(screen.getByPlaceholderText('Новий пароль'), 'NewSecure2');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти новий пароль' }));
  };

  /** Wrong digits are read again; nothing needs re-sending, so nothing is offered. */
  it('says the code is wrong, and does not offer a new one', async () => {
    vi.mocked(api.resetPassword).mockRejectedValue(refusal(400, 'CODE_WRONG'));

    await submitCode('000000');

    expect(await screen.findByText(/Невірний код/)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Запросити новий код' }),
    ).not.toBeInTheDocument();
  });

  /**
   * The distinction the single "invalid or expired" sentence could not draw. A code that
   * ran out of time cannot be fixed by retyping it, so the way out is a new one.
   */
  it('offers a new code when the old one has expired', async () => {
    vi.mocked(api.resetPassword).mockRejectedValue(refusal(400, 'CODE_EXPIRED'));

    await submitCode('482915');

    expect(await screen.findByText(/Код прострочений/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Запросити новий код' }),
    ).toBeInTheDocument();
  });

  it('offers a new code when the guesses are spent', async () => {
    vi.mocked(api.resetPassword).mockRejectedValue(
      refusal(400, 'CODE_ATTEMPTS_SPENT'),
    );

    await submitCode('000000');

    expect(await screen.findByText(/Забагато невдалих спроб/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Запросити новий код' }),
    ).toBeInTheDocument();
  });

  /** Asking again goes to the server, so the button is wired and not just drawn. */
  it('asks the server again when a new code is wanted', async () => {
    vi.mocked(api.resetPassword).mockRejectedValue(refusal(400, 'CODE_EXPIRED'));

    await submitCode('482915');
    await userEvent.click(
      await screen.findByRole('button', { name: 'Запросити новий код' }),
    );

    expect(api.requestPasswordReset).toHaveBeenCalledTimes(2);
    expect(await screen.findByText('Новий код надіслано')).toBeInTheDocument();
  });

  /**
   * The rule is checked here before the request is made, so a short password is answered
   * in the reader's language rather than by the server's own English sentence.
   */
  it('refuses a password that breaks the rule without asking the server', async () => {
    const codeField = await reachStepTwo();
    await userEvent.type(codeField, '482915');
    await userEvent.type(screen.getByPlaceholderText('Новий пароль'), 'short1A');
    await userEvent.click(screen.getByRole('button', { name: 'Зберегти новий пароль' }));

    expect(await screen.findByText(/Перевірте введені дані/)).toBeInTheDocument();
    expect(api.resetPassword).not.toHaveBeenCalled();
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
