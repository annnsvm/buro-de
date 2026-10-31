import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Both kinds of list are reset in the base layer.
 *
 * The base layer sets `list-style: inherit` on `ul, ol`, which inherits the initial `disc`, and
 * only `ul` was reset afterwards. Every ordered list in the product therefore drew bullets
 * rather than numbers - and because two components had each quietly worked around it with
 * their own `list-none p-0`, nothing looked broken until a third one didn't.
 *
 * This reads the stylesheet rather than the rendered page because jsdom applies no stylesheet
 * at all: a render test would pass with the bug still in place.
 */
const CSS = readFileSync(resolve(__dirname, '../../../src/styles/index.css'), 'utf-8');

/** The selectors of every rule that sets `list-style: none`. */
const resetSelectors = (): string[] =>
  [...CSS.matchAll(/([^{}]+)\{[^{}]*list-style:\s*none[^{}]*\}/g)].flatMap((match) =>
    match[1]
      .split(/\*\/|\n\s*\n/)
      .pop()!
      .split(',')
      .map((selector) => selector.trim())
      .filter(Boolean),
  );

describe('the base list reset', () => {
  it.each(['ul', 'ol'])('resets %s', (tag) => {
    expect(resetSelectors()).toContain(tag);
  });

  /**
   * `list-style: inherit` is what makes the reset necessary in the first place. If it is ever
   * removed, this test is the note explaining that the reset can go with it.
   */
  it('still needs the reset, because lists inherit their markers', () => {
    expect(CSS).toMatch(/list-style:\s*inherit/);
  });
});
