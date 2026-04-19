import { describe, expect, it } from 'vitest';

import contactSupportSchema from '@/features/courses-catalog/validation/contactSupportSchema';

describe('contactSupportSchema', () => {
  const valid = {
    name: 'Alex',
    email: 'alex@example.com',
    message: 'Hello there!!',
    termsAccepted: true,
  };

  it('accepts valid payload', () => {
    expect(contactSupportSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name shorter than 2 chars', () => {
    const r = contactSupportSchema.safeParse({ ...valid, name: 'A' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = contactSupportSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });

  it('rejects short message', () => {
    const r = contactSupportSchema.safeParse({ ...valid, message: 'short' });
    expect(r.success).toBe(false);
  });

  it('requires terms accepted', () => {
    const r = contactSupportSchema.safeParse({ ...valid, termsAccepted: false });
    expect(r.success).toBe(false);
  });
});
