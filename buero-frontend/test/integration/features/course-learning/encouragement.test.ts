import { describe, expect, it } from 'vitest';

import {
  encouragementFor,
  spellBlockCount,
} from '@/features/course-learning/PracticePanel/encouragement';

/**
 * Which line the hub shows under the cards. Two of the author's rules overlap, and the tests
 * pin down which one wins — that is the only part of this worth getting wrong.
 */
describe('encouragement under the block cards', () => {
  it('says nothing at all for a practice of one block until it is finished', () => {
    expect(encouragementFor(1, 0)).toBeNull();
    expect(encouragementFor(1, 1)).toMatchObject({ key: 'done' });
  });

  describe('nothing done yet', () => {
    it('invites the student in, counting the whole practice', () => {
      expect(encouragementFor(4, 0)).toEqual({ key: 'start', count: 4 });
      expect(encouragementFor(2, 0)).toEqual({ key: 'start', count: 2 });
    });

    /** Three blocks with none done is "let us begin", not "good start". */
    it('wins over the count of what is left', () => {
      expect(encouragementFor(3, 0)).toEqual({ key: 'start', count: 3 });
    });
  });

  it('calls one of four a good start', () => {
    expect(encouragementFor(4, 1)).toEqual({ key: 'goodStart', count: 3 });
  });

  describe('two blocks left', () => {
    it('is halfway when half really is behind', () => {
      expect(encouragementFor(4, 2)).toEqual({ key: 'halfway', count: 2 });
    });

    /** With three blocks, two left means one done — so the gentler line, not "halfway". */
    it('is a good start when only one of three is done', () => {
      expect(encouragementFor(3, 1)).toEqual({ key: 'goodStart', count: 2 });
    });
  });

  it('counts down to the last block', () => {
    expect(encouragementFor(4, 3)).toEqual({ key: 'almost', count: 1 });
    expect(encouragementFor(2, 1)).toEqual({ key: 'almost', count: 1 });
  });

  it('congratulates when every block is done', () => {
    expect(encouragementFor(4, 4)).toEqual({ key: 'done', count: 0 });
    expect(encouragementFor(3, 3)).toEqual({ key: 'done', count: 0 });
  });

  it('has nothing to say about a practice with no blocks', () => {
    expect(encouragementFor(0, 0)).toBeNull();
  });
});

describe('spelling the number in the opening line', () => {
  /**
   * Only the invitation spells it out. A digit there reads as a count of work to get through;
   * in the later lines, which are progress reports, a figure is exactly right.
   */
  it('names one to four in Ukrainian', () => {
    expect(spellBlockCount(1, 'uk')).toBe('Один');
    expect(spellBlockCount(4, 'uk')).toBe('Чотири');
  });

  it('names them in English too', () => {
    expect(spellBlockCount(4, 'en')).toBe('Four');
  });

  it('copes with a region suffix on the language', () => {
    expect(spellBlockCount(3, 'uk-UA')).toBe('Три');
  });

  /** A practice never holds more than four, so these are fallbacks, not expected output. */
  it('falls back to the figure beyond four or in an unknown language', () => {
    expect(spellBlockCount(7, 'uk')).toBe('7');
    expect(spellBlockCount(2, 'de')).toBe('2');
  });
});
