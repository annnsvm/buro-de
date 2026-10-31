import { buildSystemPrompt, buildUserPrompt } from './rubric';
import { MODULE_4_LETTER } from './writing-task';

/**
 * The instruction sent to the grader, guarded against going task-specific again.
 *
 * It was written while the module 4 letter was the only writing task there was, and it named that
 * letter's criteria by number and its grammar point by name. Nothing complained, because the only
 * rubric in the system was the one it was written for. These tests are what complains.
 */

describe('the grader instruction', () => {
  const prompt = buildSystemPrompt(1);

  /**
   * The three sentences that made the instruction wrong for every task but one. A rubric about a
   * forum post was told that its criteria 2, 3 and 4 each need one sentence with a conjunction,
   * and that its criterion 5 combines two requirements - about criteria it does not have.
   */
  it.each([
    ['criteria named by number', /критер\S*\s+2,\s*3/i],
    ['criterion 5 described', /критерій\s+5/i],
    ['a grammar point carved out by name', /das\/dass/i],
    ['the Verb-Verb rule', /verb-verb/i],
  ])('no longer contains %s', (_name, pattern) => {
    expect(prompt).not.toMatch(pattern);
  });

  /** What replaced them: the same three principles, said without a task in mind. */
  it.each([
    ['only the rubric counts', /повний перелік того, що перевіряється/],
    ['one correct example is enough', /достатньо ОДНОГО\s+правильного приклада/],
    ['a mistake criterion is lost to every mistake', /кожна така помилка/],
    ['criteria are read with their own conditions', /це частина\s+правила/],
  ])('states that %s', (_name, pattern) => {
    expect(prompt).toMatch(pattern);
  });

  it('asks for a note on every criterion, awarded or not', () => {
    expect(prompt).toMatch(/Пишіть\s+note і тоді, коли бал зараховано/);
  });
});

describe('naming the criterion that was counted', () => {
  it('names criterion 1 when that is the one about length', () => {
    const prompt = buildSystemPrompt(1);
    expect(prompt).toContain('criterion_1');
    expect(prompt).toMatch(/Критерій 1 \(довжина\)/);
  });

  /**
   * The number is not always 1. The criteria arrive in the order their author typed them, so a
   * rubric that opens with a grammar point and asks about length third must say three - otherwise
   * the model is told to echo a value for a criterion that is not the counted one.
   */
  it('names the third criterion when length is third', () => {
    const prompt = buildSystemPrompt(3);
    expect(prompt).toContain('criterion_3');
    expect(prompt).not.toContain('criterion_1');
  });

  /** A rubric that never mentions sentences has nothing pre-decided. */
  it('says nothing about a counted criterion when there is none', () => {
    const prompt = buildSystemPrompt(null);
    expect(prompt).not.toMatch(/criterion_/);
    expect(prompt).not.toMatch(/підрахунком/);
  });
});

describe('the request', () => {
  const letter = 'Sehr geehrte Frau Schmidt,\n\nIch bin krank.\n\nMit freundlichen Grüßen';

  it('numbers the criteria in the author’s own order', () => {
    const body = buildUserPrompt(MODULE_4_LETTER.criteria, letter, true, 7, 1);
    MODULE_4_LETTER.criteria.forEach((criterion, index) => {
      expect(body).toContain(`${index + 1}. ${criterion}`);
    });
  });

  it('passes the counted verdict under the matching name', () => {
    const body = buildUserPrompt(MODULE_4_LETTER.criteria, letter, false, 4, 2);
    expect(body).toContain('criterion_2: false');
    expect(body).toContain('4 речень');
  });

  it('leaves the counted line out when no criterion is counted', () => {
    const body = buildUserPrompt(['Текст у Perfekt', 'Три різні дієслова'], letter, true, 7, null);
    expect(body).not.toMatch(/criterion_/);
    expect(body).toContain('Текст студента:');
  });

  it('sends the text as written, trimmed', () => {
    const body = buildUserPrompt(['a', 'b'], `\n\n${letter}\n\n`, true, 7, 1);
    expect(body).toContain(`"""\n${letter}\n"""`);
  });
});
