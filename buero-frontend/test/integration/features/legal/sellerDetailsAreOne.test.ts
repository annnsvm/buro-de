import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { SELLER } from '@/seo/seller';

/**
 * Every legal page says the same thing about who is selling.
 *
 * Four pages carried a Kyiv address while two new ones were written with the registered
 * Kharkiv one, and nothing would have caught it: each page read correctly on its own, and
 * only opening two of them side by side showed the site contradicting itself about the
 * seller. On legal pages that is not cosmetic.
 *
 * So this reads the source rather than rendering: an address or an email typed into a page
 * is the defect, wherever it happens to be correct today.
 */

const LEGAL_PAGES = [
  'src/pages/PrivacyPolicyPage/PrivacyPolicyPage.tsx',
  'src/pages/TermsOfServicePage/TermsOfServicePage.tsx',
  'src/pages/CookiesPolicyPage/CookiesPolicyPage.tsx',
  'src/pages/PaymentPolicyPage/PaymentPolicyPage.tsx',
  'src/pages/PublicOfferPage/PublicOfferPage.tsx',
] as const;

const source = (path: string) => readFileSync(path, 'utf8');

describe('the seller details live in one place', () => {
  it.each(LEGAL_PAGES)('%s reads them from the constant', (path) => {
    expect(source(path)).toContain("from '@/seo/seller'");
  });

  it.each(LEGAL_PAGES)('%s types no address of its own', (path) => {
    const text = source(path);
    /** Any street line is one somebody will later forget to update. */
    expect(text).not.toMatch(/вул\.\s*[А-ЯІЇЄҐ]/);
    expect(text).not.toMatch(/м\.\s*Київ/);
  });

  it.each(LEGAL_PAGES)('%s types no email address of its own', (path) => {
    expect(source(path)).not.toMatch(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
  });
});

describe('the constant itself', () => {
  /** Written out, because comparing the constant with itself proves nothing. */
  it('holds the registered details exactly as given', () => {
    expect(SELLER.name).toBe('Самойлова Анна Геннадіївна');
    expect(SELLER.registry).toBe('2011600000000064435');
    expect(SELLER.email).toBe('burode452@gmail.com');
    expect(SELLER.phone).toBe('+380634871127');
    expect(SELLER.address).toContain('Харків');
    expect(SELLER.address).toContain('134/16');
  });
});
