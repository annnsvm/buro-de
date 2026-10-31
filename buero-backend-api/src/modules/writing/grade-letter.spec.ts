import type Anthropic from '@anthropic-ai/sdk';
import { gradeLetter } from './grade-letter';
import { MODULE_4_LETTER, type WritingTask } from './writing-task';

/**
 * What `gradeLetter` decides without the model, and what it does to the model's answer.
 *
 * Two things here used to be assumptions rather than readings of the rubric: that every writing
 * task is a letter, and that the criterion about length is the first one. The module 4 letter made
 * both true, so neither was ever wrong until there was a second task.
 */

/** Verdicts for a rubric of `count` criteria, every one awarded by the "model". */
const allMet = (count: number) => ({
  criteria: Array.from({ length: count }, (_value, index) => ({
    id: index + 1,
    met: true,
    note: `критерій ${index + 1}`,
  })),
});

const stubClient = (parsed: unknown) => {
  const parse = jest.fn().mockResolvedValue({
    parsed_output: parsed,
    usage: { input_tokens: 900, output_tokens: 400 },
  });
  return { client: { messages: { parse } } as unknown as Anthropic, parse };
};

/** The text of the system and user prompt actually sent, for asserting on what was told. */
const sent = (parse: jest.Mock) => {
  const [body] = parse.mock.calls[0] as [
    { system: string; messages: Array<{ content: string }> },
  ];
  return { system: body.system, user: body.messages[0].content };
};

const SALUTATION = 'Sehr geehrte Frau Schmidt,';
const SEVEN_SENTENCES =
  'ich bin heute krank. Die Besprechung muss ich absagen. Das tut mir leid. ' +
  'Ich gehe zum Arzt. Ich hoffe, dass ich bald gesund bin. Wenn es länger dauert, ' +
  'sage ich Bescheid. Vielen Dank für Ihr Verständnis.';
const LETTER = `${SALUTATION}\n\n${SEVEN_SENTENCES}\n\nMit freundlichen Grüßen\nOlha`;

describe('a rubric whose length criterion is not the first', () => {
  /** The same requirements as module 4, typed in a different order by their author. */
  const task: WritingTask = {
    task: 'Напишіть листа керівникові.',
    minSentences: 6,
    maxSentences: 8,
    criteria: [
      'Є речення з weil, побудоване правильно',
      'Є речення з dass, побудоване правильно',
      'У тілі листа 6–8 речень; є звертання і формула прощання',
    ],
  };

  /** Three sentences where six were asked for: the counted criterion must come back false. */
  const TOO_FEW = `${SALUTATION}\n\nIch bin krank. Ich gehe zum Arzt. Danke.\n\nMit freundlichen Grüßen`;

  it('overwrites the third criterion, not the first', async () => {
    const { client, parse } = stubClient(allMet(3));
    const result = await gradeLetter(task, LETTER, client);

    if (result.status !== 'graded') throw new Error('expected a graded result');
    const verdicts = result.assessment.criteria;
    /** The length is right here, so the overwrite is invisible in `met` - check it was told. */
    expect(sent(parse).system).toContain('criterion_3');
    expect(verdicts.find((v) => v.id === 3)?.met).toBe(true);
  });

  /**
   * The case the old code got wrong. With three sentences the counted verdict is false; the old
   * code wrote that false onto criterion 1 - the one about weil, which the model had awarded.
   */
  it('takes the mark off the length criterion and leaves weil alone', async () => {
    const { client } = stubClient(allMet(3));
    const result = await gradeLetter(task, TOO_FEW, client);

    /** Three sentences is below the minimum, so the free check settles it before any call. */
    expect(result).toMatchObject({ status: 'rejected', reason: 'too_short', calledModel: false });
  });

  /** Over the maximum is not turned away - it reaches the model and loses the counted mark. */
  it('loses the length criterion when the text runs long', async () => {
    const tooMany = `${SALUTATION}\n\n${SEVEN_SENTENCES} Noch ein Satz. Und noch einer.\n\nMit freundlichen Grüßen`;
    const { client } = stubClient(allMet(3));
    const result = await gradeLetter(task, tooMany, client);

    if (result.status !== 'graded') throw new Error('expected a graded result');
    expect(result.assessment.criteria.find((v) => v.id === 3)?.met).toBe(false);
    expect(result.assessment.criteria.find((v) => v.id === 1)?.met).toBe(true);
    expect(result.score).toBe(2);
  });
});

describe('a task that is not a letter', () => {
  const task: WritingTask = {
    task: 'Опишіть свій робочий день.',
    minSentences: 6,
    maxSentences: 10,
    criteria: [
      'У тексті 6–10 речень',
      'Текст у Präsens',
      'Є щонайменше три різні дієслова',
    ],
  };

  const DESCRIPTION =
    'Mein Arbeitstag beginnt um acht Uhr. Zuerst lese ich meine E-Mails. ' +
    'Dann rufe ich zwei Kunden an. Um zehn haben wir eine Besprechung. ' +
    'Danach schreibe ich das Protokoll. Mittags esse ich in der Kantine. ' +
    'Am Nachmittag arbeite ich an einem Angebot.';

  /**
   * The bug this file was written for. The service stopped refusing non-letters, but `gradeLetter`
   * ran its own check with the default on, so a description still came back "no salutation" - one
   * layer further down, where the fix had not reached.
   */
  it('is graded rather than refused for having no salutation', async () => {
    const { client } = stubClient(allMet(3));
    const result = await gradeLetter(task, DESCRIPTION, client);

    expect(result.status).toBe('graded');
  });

  it('still earns its length criterion', async () => {
    const { client } = stubClient(allMet(3));
    const result = await gradeLetter(task, DESCRIPTION, client);

    if (result.status !== 'graded') throw new Error('expected a graded result');
    expect(result.assessment.criteria.find((v) => v.id === 1)?.met).toBe(true);
  });
});

describe('a rubric that never mentions length', () => {
  const task: WritingTask = {
    task: 'Напишіть пост на форум.',
    minSentences: 4,
    maxSentences: 12,
    criteria: ['Відповідь по темі й зрозуміла', 'Є два приклади з життя'],
  };

  const POST =
    'Ich finde das Thema wichtig. Bei mir im Betrieb war es genauso. ' +
    'Mein Kollege hat auch davon erzählt. Deshalb lohnt es sich.';

  it('leaves every verdict to the model', async () => {
    const { client, parse } = stubClient({
      criteria: [
        { id: 1, met: false, note: 'не по темі' },
        { id: 2, met: true, note: 'два приклади є' },
      ],
    });
    const result = await gradeLetter(task, POST, client);

    if (result.status !== 'graded') throw new Error('expected a graded result');
    /** Nothing is pre-decided, so nothing is said about a counted criterion. */
    expect(sent(parse).system).not.toMatch(/criterion_/);
    expect(sent(parse).user).not.toMatch(/criterion_/);
    /** The model's false stands - it is not replaced by the sentence count, which would pass. */
    expect(result.assessment.criteria.find((v) => v.id === 1)?.met).toBe(false);
    expect(result.score).toBe(1);
  });
});

describe('the module 4 letter', () => {
  /** The task the prompt was originally written for: its behaviour must not have moved. */
  it('still counts criterion 1 and says so', async () => {
    const { client, parse } = stubClient(allMet(6));
    const result = await gradeLetter(MODULE_4_LETTER, LETTER, client);

    if (result.status !== 'graded') throw new Error('expected a graded result');
    expect(sent(parse).system).toContain('criterion_1');
    expect(sent(parse).user).toMatch(/criterion_1: true/);
    expect(result.score).toBe(6);
  });

  it('reports what the call consumed', async () => {
    const { client } = stubClient(allMet(6));
    const result = await gradeLetter(MODULE_4_LETTER, LETTER, client);

    if (result.status !== 'graded') throw new Error('expected a graded result');
    expect(result.usage).toEqual({ inputTokens: 900, outputTokens: 400 });
  });
});
