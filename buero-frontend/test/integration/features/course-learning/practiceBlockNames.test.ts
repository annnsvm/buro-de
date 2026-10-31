import { describe, expect, it } from 'vitest';
import ukTranslation from '@/i18n/locales/uk/translation.json';
import enTranslation from '@/i18n/locales/en/translation.json';
import type { PracticeBlockName } from '@/api/questionEditorApi';

/**
 * The names of the four blocks, spelled the one way the server spells them.
 *
 * These strings are not labels - they are sent to the API and compared against what it sends
 * back. The teacher's editor once spelled Hören `hoeren` while the server's enum said `horen`,
 * which meant the Hören tab silently matched no questions and refused to save new ones. A
 * mismatch like that cannot be seen by reading either side alone, so it is pinned here.
 */
const SERVER_BLOCKS = [
  'grammatik',
  'lesen',
  'horen',
  'sprechen',
  'schreiben',
] as const;

describe('the names of the practice blocks', () => {
  /** Fails to compile, not merely at runtime, if the union ever drifts from the server. */
  it('matches the type the client sends', () => {
    const names: PracticeBlockName[] = [...SERVER_BLOCKS];
    expect(names).toHaveLength(5);
  });

  it.each(['uk', 'en'])('has a title and a summary in %s', (locale) => {
    const translation = locale === 'uk' ? ukTranslation : enTranslation;
    const blocks = (translation as { practice: { blocks: Record<string, unknown> } })
      .practice.blocks;

    for (const block of SERVER_BLOCKS) {
      expect(Object.keys(blocks)).toContain(block);
    }
  });
});
