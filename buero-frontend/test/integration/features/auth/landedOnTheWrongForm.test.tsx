import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError } from 'axios';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * Landing on the wrong one of the two forms.
 *
 * "Try the course" and "Buy" both open registration, which is right for the people those
 * buttons are mostly aimed at. It is wrong for the student who already has an account and
 * types the address they have always used here: they are told the address is taken and
 * left to work out that the way in is a link at the bottom of the box.
 *
 * The login form has answered the opposite case for a while - an address with no account
 * gets a button that opens registration, carrying the address over. This is the mirror of
 * it, so neither form is a dead end. Which one opens first stops mattering much once both
 * can hand over.
 */
const post = vi.fn();
vi.mock('@/api/apiInstance', () => ({
  apiInstance: {
    post: (...a: unknown[]) => post(...a),
    get: vi.fn(),
  },
}));

const { default: SignUpModalPanel } = await import(
  '@/features/auth/components/SignUpModalPanel'
);
const { default: LoginModalPanel } = await import(
  '@/features/auth/components/LoginModalPanel'
);

const refusal = (status: number, code: string) =>
  new AxiosError('refused', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    statusText: '',
    data: { statusCode: status, code },
    headers: {},
    config: { headers: {} } as never,
  });

beforeAll(async () => {
  await i18nReady;
});

beforeEach(() => {
  vi.clearAllMocks();
});

const draw = () =>
  renderWithProviders(
    <BaseDialog isOpen handleOpenChange={vi.fn()}>
      <SignUpModalPanel onDismiss={vi.fn()} />
    </BaseDialog>,
  );

const fillAndSubmit = async (email = 'anna@example.com') => {
  await userEvent.type(screen.getByPlaceholderText("Ім'я"), 'Анна');
  await userEvent.type(screen.getByPlaceholderText('Email'), email);
  await userEvent.type(screen.getByPlaceholderText('Пароль'), 'SecurePass1');
  await userEvent.click(screen.getByRole('button', { name: 'Зареєструватися' }));
};

describe('signing up with an address that already has an account', () => {
  it('says so', async () => {
    post.mockRejectedValue(refusal(409, 'EMAIL_TAKEN'));
    draw();

    await fillAndSubmit();

    expect(await screen.findByText(/вже зареєстрована/)).toBeInTheDocument();
  });

  /** The part that matters: a way out, not only an explanation. */
  it('offers the way in', async () => {
    post.mockRejectedValue(refusal(409, 'EMAIL_TAKEN'));
    draw();

    await fillAndSubmit();

    expect(await screen.findByRole('button', { name: 'Увійти' })).toBeInTheDocument();
  });

  /** And carries the address, which has been typed once already. */
  it('opens the login with the address already in it', async () => {
    post.mockRejectedValue(refusal(409, 'EMAIL_TAKEN'));
    const { store } = draw();

    await fillAndSubmit('olena@example.com');
    await userEvent.click(await screen.findByRole('button', { name: 'Увійти' }));

    await waitFor(() =>
      expect(store.getState().ui.globalModal).toMatchObject({
        type: 'login',
        prefillEmail: 'olena@example.com',
      }),
    );
  });

  /** No other failure has a second form to hand over to, so none of them offers one. */
  it('offers nothing of the sort when the server simply broke', async () => {
    post.mockRejectedValue(refusal(500, 'SERVER'));
    draw();

    await fillAndSubmit();

    await screen.findByText(/Щось зламалося/);
    expect(screen.queryByRole('button', { name: 'Увійти' })).not.toBeInTheDocument();
  });
});

/** The other half of the handover: the login form has to take the address it is given. */
describe('the login form it hands over to', () => {
  it('starts with the address already filled in', async () => {
    renderWithProviders(
      <BaseDialog isOpen handleOpenChange={vi.fn()}>
        <LoginModalPanel prefillEmail="olena@example.com" onDismiss={vi.fn()} />
      </BaseDialog>,
    );

    expect(await screen.findByDisplayValue('olena@example.com')).toBeInTheDocument();
  });

  it('is empty when nothing was carried over', async () => {
    renderWithProviders(
      <BaseDialog isOpen handleOpenChange={vi.fn()}>
        <LoginModalPanel onDismiss={vi.fn()} />
      </BaseDialog>,
    );

    expect(await screen.findByPlaceholderText('Email')).toHaveValue('');
  });
});
