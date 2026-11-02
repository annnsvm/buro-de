import { SCHREIBEN_SYSTEM_PROMPT } from './rubric';

/**
 * The instruction sent with every text, guarded against the two ways it has already gone wrong.
 *
 * The first was writing it for one task: it named the module 4 letter's criteria by number and
 * its grammar point by name, and nothing complained, because that letter was the only writing
 * task in the system. The second was asking the checker a question that is not its to answer.
 */
describe('the checker instruction', () => {
  /**
   * A rubric about a forum post was told rules about criteria it does not have - that its
   * criteria 2, 3 and 4 each need a sentence with a conjunction, that its criterion 5 combines
   * two requirements. Only the task's own rubric may name its criteria.
   */
  it.each([
    ['criteria named by number', /критер\S*\s+2,\s*3/i],
    ['criterion 5 described', /критерій\s+5\b/i],
    ['a grammar point carved out by name', /das\/dass/i],
    ['the Verb-Verb rule', /verb-verb/i],
  ])('does not contain %s', (_name, pattern) => {
    expect(SCHREIBEN_SYSTEM_PROMPT).not.toMatch(pattern);
  });

  /**
   * Whether a text was copied is settled in code, before the model is called and without
   * costing the student a check.
   *
   * The instruction used to say both things at once: that the student's text need not resemble
   * the sample, and that a text copied from the sample scores zero on every criterion. Where the
   * line between the two fell was left to the model, and Claude Opus 5.5 drew it differently for
   * texts that overlapped the sample equally - two of the author's own letters at 0.905 overlap
   * were marked 5/6 and 0/6. Six of her ten graded letters came back as straight zeros.
   */
  it('does not ask the checker to judge copying', () => {
    expect(SCHREIBEN_SYSTEM_PROMPT).not.toMatch(/скопійован/i);
    expect(SCHREIBEN_SYSTEM_PROMPT).toMatch(/Схожість на зразок не оцінюй/);
  });

  /** What the sample is for, said once and not contradicted later. */
  it('calls the sample an illustration', () => {
    expect(SCHREIBEN_SYSTEM_PROMPT).toMatch(/лише ілюстрація/);
    expect(SCHREIBEN_SYSTEM_PROMPT).toMatch(/НЕ мусить бути схожим на зразок/);
  });

  /** Off topic and not in German are still the checker's to judge: code cannot read a topic. */
  it('still refuses a text that is off topic or not in German', () => {
    expect(SCHREIBEN_SYSTEM_PROMPT).toMatch(/не на тему або не німецькою/);
  });

  /**
   * The author's own rules for one task outrank the general instruction, which is what lets her
   * write "в цьому уроці привітання не рахується" without anyone touching code.
   */
  it('gives the author’s note priority', () => {
    expect(SCHREIBEN_SYSTEM_PROMPT).toMatch(/пріоритетна інструкція/);
  });

  /** The answer has to fit the budget, so the instruction states the lengths it asks for. */
  it.each([
    ['an empty comment on an awarded criterion', /якщо point = 1, comment = ""/],
    ['at most three corrections', /не більше 3 пунктів/],
  ])('asks for %s', (_name, pattern) => {
    expect(SCHREIBEN_SYSTEM_PROMPT).toMatch(pattern);
  });
});
