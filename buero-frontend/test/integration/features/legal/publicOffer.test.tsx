import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../../utils/renderWithProviders';
import { PUBLIC_PAGES } from '@/seo/publicPages';
import { SELLER } from '@/seo/seller';
import { ROUTES } from '@/helpers/routes';

/**
 * The offer is the contract a student enters into by paying, so the assertions here are
 * about the clauses that decide money and access - not about wording.
 *
 * Two of them are load-bearing in a way a legal page usually is not: the refund window ends
 * when a paid lesson is opened, which the platform records, and a refund keeps the student's
 * progress. Both describe what the code actually does, so if the code changes and these
 * clauses do not, the site is promising something it no longer delivers.
 */

const { default: PublicOfferPage } = await import('@/pages/PublicOfferPage/PublicOfferPage');

describe('the offer names the seller', () => {
  /** Both pages read the same constant, so they cannot disagree about who is selling. */
  it('gives the same details as the payment page, from one source', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getAllByText(new RegExp(SELLER.name)).length).toBeGreaterThan(0);
    expect(screen.getByText(new RegExp(SELLER.registry))).toBeInTheDocument();
    expect(screen.getByText(/Харків/)).toBeInTheDocument();
  });

  it('is reachable by email and phone', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(
      screen.getAllByRole('link', { name: new RegExp(SELLER.email) })[0],
    ).toHaveAttribute('href', `mailto:${SELLER.email}`);
  });
});

describe('how the contract is entered into', () => {
  it('says paying is the acceptance', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/Акцептом є оплата/)).toBeInTheDocument();
  });

  it('calls itself an offer from the sole trader', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/офіційною та публічною пропозицією/)).toBeInTheDocument();
  });
});

describe('the refund clauses, which have to match the platform', () => {
  it('ends the 14 day window when a paid lesson is opened', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/14 календарних днів/)).toBeInTheDocument();
    expect(screen.getByText(/не відкривав жодного уроку платної частини/)).toBeInTheDocument();
  });

  /** The platform records lesson opens, so this is checkable rather than arguable. */
  it('says the platform records that moment itself', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/фіксується Платформою автоматично/)).toBeInTheDocument();
  });

  it('keeps the refund grounds that survive a started course', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/не було надано з вини Виконавця/)).toBeInTheDocument();
    expect(screen.getByText(/суттєво не відповідає опису/)).toBeInTheDocument();
  });

  /** Exactly what markRefunded does: delete the access, leave the progress. */
  it('promises the course closes and the progress survives', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/доступ до Курсу закривається/)).toBeInTheDocument();
    expect(screen.getByText(/Прогрес навчання/)).toBeInTheDocument();
  });

  it('does not sign away consumer rights', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/не обмежують прав Користувача як споживача/)).toBeInTheDocument();
  });
});

describe('the clauses a contract needs to be one', () => {
  it.each([
    ['інтелектуальної власності', /Права інтелектуальної власності/],
    ['персональні дані', /Персональні дані/],
    ['форс-мажор', /Форс-мажор/],
    ['вирішення спорів', /Вирішення спорів/],
    ['строк дії', /Строк дії та зміни оферти/],
  ])('has a section on %s', (_label, pattern) => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByRole('heading', { name: pattern })).toBeInTheDocument();
  });

  it('applies Ukrainian law', () => {
    renderWithProviders(<PublicOfferPage />);
    expect(screen.getByText(/застосовується право України/)).toBeInTheDocument();
  });
});

describe('the page is reachable', () => {
  it('has its own route', () => {
    expect(ROUTES.OFFER).toBe('/offer');
  });

  it('is prerendered, so it reads without JavaScript', () => {
    const page = PUBLIC_PAGES.find((entry) => entry.path === '/offer');
    expect(page?.title).toContain('Публічна оферта');
    expect(page?.file).toBe('offer/index.html');
  });
});
