import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';
import { ROUTES } from '@/helpers/routes';

/**
 * The refund answer on the landing page.
 *
 * The question was already there with a placeholder for an answer - "Умови повернення коштів
 * з'являться тут" - which is the worst thing it could say to somebody deciding whether to
 * pay. Now it answers, and what it answers has to agree with the offer: a short version that
 * promises more than clause 7 does would be the one a buyer quotes back.
 */

await i18nReady;
const { default: Faq } = await import('@/features/landing/Faq/Faq');

const openRefundAnswer = async () => {
  renderWithProviders(<Faq />);
  const question = screen.getByRole('button', { name: /повернути кошти/i });
  await userEvent.click(question);
  return question;
};

describe('the refund question on the landing page', () => {
  it('no longer says the terms will appear later', () => {
    renderWithProviders(<Faq />);
    expect(screen.queryByText(/з.являться тут/)).not.toBeInTheDocument();
  });

  it('gives the window and what closes it', async () => {
    await openRefundAnswer();
    const answer = screen.getByText(/14 днів після оплати/);
    expect(answer).toBeInTheDocument();
    expect(answer).toHaveTextContent(/не відкривали жодного платного уроку/);
  });

  /** The grounds that survive a started course, exactly as clause 7.4 of the offer has them. */
  it('keeps the grounds that outlast the window', async () => {
    await openRefundAnswer();
    expect(screen.getByText(/не відповідає опису/)).toBeInTheDocument();
  });

  /** What the code really does, so the FAQ cannot contradict the platform. */
  it('says the progress survives a refund', async () => {
    await openRefundAnswer();
    expect(screen.getByText(/Прогрес навчання при цьому зберігається/)).toBeInTheDocument();
  });

  it('links to the full terms rather than paraphrasing them', async () => {
    await openRefundAnswer();
    const link = screen.getByRole('link', { name: /Умови оплати й повернення/i });
    expect(link).toHaveAttribute('href', ROUTES.PAYMENT);
  });
});
