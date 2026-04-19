import { describe, expect, it } from 'vitest';

import { profileSchema } from '@/features/profile/validation/profileSchema';

describe('profileSchema', () => {
  it('accepts name-only update', () => {
    const r = profileSchema.safeParse({
      name: 'Anna',
      bio: '',
      isActive: true,
      currentPassword: '',
      newPassword: '',
      retypePassword: '',
    });
    expect(r.success).toBe(true);
  });

  it('rejects empty name', () => {
    const r = profileSchema.safeParse({
      name: '',
      currentPassword: '',
      newPassword: '',
      retypePassword: '',
    });
    expect(r.success).toBe(false);
  });

  it('when changing password requires current password', () => {
    const r = profileSchema.safeParse({
      name: 'Anna',
      currentPassword: '',
      newPassword: 'ValidPass1',
      retypePassword: 'ValidPass1',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.flatten().fieldErrors.currentPassword?.length).toBeGreaterThan(0);
    }
  });

  it('validates new password rules', () => {
    const r = profileSchema.safeParse({
      name: 'Anna',
      currentPassword: 'old',
      newPassword: 'short',
      retypePassword: 'short',
    });
    expect(r.success).toBe(false);
  });

  it('requires matching retype password', () => {
    const r = profileSchema.safeParse({
      name: 'Anna',
      currentPassword: 'oldpass1',
      newPassword: 'Newpass123',
      retypePassword: 'Otherpass123',
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.flatten().fieldErrors.retypePassword?.length).toBeGreaterThan(0);
    }
  });
});
