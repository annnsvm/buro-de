import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * No error message may be lifted out of the page's flow.
 *
 * This has now happened twice, in two different files, and both times it looked right
 * until somebody read the message on a phone.
 *
 * An element taken out of the flow cannot push anything down, so when its text needs a
 * second line the only direction left is up - over the field being filled in. It holds for
 * exactly as long as every message fits on one line, which is why both were written that
 * way and why neither looked wrong on a wide screen. Translating the wordings into
 * Ukrainian, which runs longer than the English it replaced, broke the first; a narrow
 * phone broke the second.
 *
 *   FormField:         `absolute -bottom-1 left-3 ...text-[var(--color-error)]`
 *   SignUpModalPanel:  `absolute bottom-16 left-3 ...text-[var(--color-error)]`
 *
 * Nothing else would notice a third. Space for a message is held open with `min-h`, not by
 * lifting it off the page.
 *
 * The scan reads plain class strings, which is the shape both mistakes took. A class list
 * assembled from an array or a ternary would slip past it - the point is to catch the easy
 * way of making this mistake, not to prove it can never be made.
 */
const CLASS_ATTRIBUTE = /className=(?:"([^"]*)"|\{`([^`]*)`\}|\{'([^']*)'\})/g;

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return entry.endsWith('.tsx') ? [path] : [];
  });

describe('error messages', () => {
  it('are never positioned absolutely', () => {
    const offenders: string[] = [];

    for (const path of sourceFiles('src')) {
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(CLASS_ATTRIBUTE)) {
        const classes = match[1] ?? match[2] ?? match[3] ?? '';
        if (classes.includes('color-error') && /\babsolute\b/.test(classes)) {
          offenders.push(`${path}: ${classes}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  /**
   * And the space is still held, so a form does not jolt the moment a message appears -
   * which is worst exactly when someone is correcting a password and watching the field.
   */
  it('still have their space held open in FormField', () => {
    const source = readFileSync('src/components/ui/FormField/FormField.tsx', 'utf8');

    expect(source).toContain('min-h-5');
    expect(source).not.toMatch(/className="[^"]*\babsolute\b[^"]*color-error/);
  });
});
