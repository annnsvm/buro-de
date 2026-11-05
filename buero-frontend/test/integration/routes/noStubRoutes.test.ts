import { readFileSync } from 'fs';
import { describe, expect, it } from 'vitest';

/**
 * No live address serves a placeholder.
 *
 * Seven pages shipped as ten-line stubs - "AccountSettingsPage / Language, timezone,
 * account preferences" and the like - routed and reachable by anyone who typed the URL.
 * Nothing in the interface linked to them, which is exactly why they survived: they were
 * invisible to everyone except a visitor who found one.
 *
 * Read from the source rather than rendered, because the failure is a route existing at
 * all, and a test that had to mount the router would only prove the ones it thought to
 * visit.
 */
const GONE = [
  'ASSESSMENT',
  'RESULTS',
  'TRIAL_DASHBOARD',
  'SUBSCRIBED_DASHBOARD',
  'SETTINGS_ACCOUNT',
  'TEACHERS',
  'PROFILE',
];

const routes = readFileSync('src/helpers/routes.ts', 'utf8');
const router = readFileSync('src/routes/index.tsx', 'utf8');

describe('the placeholder pages', () => {
  it.each(GONE)('has no route named %s', (name) => {
    expect(routes).not.toContain(`${name}:`);
    expect(router).not.toContain(`ROUTES.${name}`);
  });

  /** The ones that carry real screens are still there, so this did not take too much. */
  it.each(['HOME', 'COURSES', 'MY_LEARNING', 'COURSE', 'VOCABULARY', 'PRIVACY'])(
    'keeps %s',
    (name) => {
      expect(routes).toContain(`${name}:`);
    },
  );
});
