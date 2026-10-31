import { describe, expect, it } from 'vitest';
import uk from '@/i18n/locales/uk/translation.json';
import en from '@/i18n/locales/en/translation.json';

/**
 * The label pairs that used to be one string joined by a separator.
 *
 * Each of these was split in two so the two facts could be set apart by layout instead of by a
 * character, and the old joined key was then deleted. A missing half does not crash anything -
 * i18next simply prints the key name - so a typo here would ship as `landing.heroCardLanguageName`
 * across the hero of the landing page. That is what this guards.
 */
const PAIRS: Array<[string, string]> = [
  ['landing.heroCardIntegrationName', 'landing.heroCardIntegrationLevel'],
  ['landing.heroCardLanguageName', 'landing.heroCardLanguageLessons'],
  ['landing.ctaCardLanguageName', 'landing.ctaCardLanguageLessons'],
  ['landing.platformModuleNumber', 'landing.platformModuleTitle'],
  ['courses.pathStepNumber', 'courses.pathStepLevel'],
  ['myLearning.continueMetaCourse', 'myLearning.continueMetaLesson'],
];

/** The joined keys these replaced. Leaving one behind invites it back into use. */
const RETIRED = [
  'landing.heroCardIntegration',
  'landing.heroCardLanguage',
  'landing.ctaCardLanguage',
  'landing.platformModule',
  'courses.pathStep',
  'courses.modal.coverMeta',
  'myLearning.continueMeta',
];

const read = (translation: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (at, part) =>
        at && typeof at === 'object'
          ? (at as Record<string, unknown>)[part]
          : undefined,
      translation,
    );

describe('the two halves of every split label', () => {
  it.each(PAIRS.flat())('%s exists in both locales', (key) => {
    expect(read(uk, key), `missing in uk: ${key}`).toBeTypeOf('string');
    expect(read(en, key), `missing in en: ${key}`).toBeTypeOf('string');
  });

  it.each(RETIRED)('%s is gone from both locales', (key) => {
    expect(read(uk, key)).toBeUndefined();
    expect(read(en, key)).toBeUndefined();
  });

  /** And none of them brought the separator along into its replacement. */
  it.each(PAIRS.flat())('%s carries no separator character', (key) => {
    expect(String(read(uk, key))).not.toContain('·');
    expect(String(read(en, key))).not.toContain('·');
  });
});
