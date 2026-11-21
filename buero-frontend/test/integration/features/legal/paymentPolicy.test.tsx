import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../utils/renderWithProviders';
import { PUBLIC_PAGES } from '@/seo/publicPages';
import { ROUTES } from '@/helpers/routes';
import { SELLER } from '@/seo/seller';

/**
 * The page that says who is selling and what happens to the money.
 *
 * A seller in e-commerce has to give free access to who they are, and the site gave none of
 * it anywhere. The Terms made it worse by pointing refunds at a "Публічна оферта" that was
 * never published, so the one thing a buyer might look for before paying led nowhere.
 *
 * These assertions are about the details being present and correct, not about wording: the
 * registry number and the address are the parts nobody would notice were wrong.
 */

const { default: PaymentPolicyPage } = await import(
  '@/pages/PaymentPolicyPage/PaymentPolicyPage'
);

describe('the seller details the law requires', () => {
  it('names the sole trader', () => {
    renderWithProviders(<PaymentPolicyPage />);
    expect(screen.getByText(new RegExp(SELLER.name))).toBeInTheDocument();
  });

  it('gives the registry number exactly', () => {
    renderWithProviders(<PaymentPolicyPage />);
    expect(screen.getByText(/2011600000000064435/)).toBeInTheDocument();
  });

  /**
   * The registered address, and the city written out rather than read back off the constant:
   * an assertion that only compares the page with the constant cannot catch the constant
   * itself being wrong, which is the mistake that would actually matter here.
   */
  it('gives the registered address', () => {
    renderWithProviders(<PaymentPolicyPage />);
    expect(screen.getByText(/Харків/)).toBeInTheDocument();
    expect(screen.getByText(/134\/16/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(SELLER.address))).toBeInTheDocument();
  });

  it('gives a working email and phone', () => {
    renderWithProviders(<PaymentPolicyPage />);
    const mail = screen.getAllByRole('link', { name: new RegExp(SELLER.email) })[0];
    expect(mail).toHaveAttribute('href', `mailto:${SELLER.email}`);
    const phone = screen.getAllByRole('link', {
      name: new RegExp(SELLER.phone.replace('+', '\\+')),
    })[0];
    expect(phone).toHaveAttribute('href', `tel:${SELLER.phone}`);
  });
});

describe('what the page promises about a refund', () => {
  it('names the payment service the site actually uses', () => {
    renderWithProviders(<PaymentPolicyPage />);
    expect(screen.getAllByText(/WayForPay/).length).toBeGreaterThan(0);
  });

  /**
   * Both halves of what the code does on a refund. The access really is deleted and the
   * progress really is kept, so the page has to say both - otherwise a student who buys
   * again cannot know their work survived.
   */
  it('says the course closes and the progress stays', () => {
    renderWithProviders(<PaymentPolicyPage />);
    expect(screen.getByText(/доступ до курсу закривається/i)).toBeInTheDocument();
    expect(screen.getByText(/Прогрес навчання при цьому зберігається/i)).toBeInTheDocument();
  });

  it('states the 14 day window and what ends it', () => {
    renderWithProviders(<PaymentPolicyPage />);
    expect(screen.getByText(/14 календарних днів/)).toBeInTheDocument();
    expect(screen.getByText(/не розпочав проходження платної частини/)).toBeInTheDocument();
  });
});

describe('the page is reachable', () => {
  it('has a route of its own', () => {
    expect(ROUTES.PAYMENT).toBe('/payment');
  });

  /** Prerendered like the other legal pages, so it is readable without JavaScript. */
  it('is prerendered with its own title', () => {
    const page = PUBLIC_PAGES.find((entry) => entry.path === '/payment');
    expect(page).toBeDefined();
    expect(page?.title).toContain('Оплата і повернення коштів');
    expect(page?.file).toBe('payment/index.html');
  });
});
