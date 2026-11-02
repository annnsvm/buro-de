/**
 * The author's own four parts of a writing task, told apart by her own labels.
 *
 * Her files write a task as "Ситуація: …", "Завдання: …", "Обовʼязково: …", "Опори: …", in that
 * order. On screen that was one run-on paragraph, which buries the part a student most needs -
 * what must be in the text to earn the marks.
 *
 * Nothing is invented and nothing is dropped: a task written without the labels comes back as
 * one block of prose, exactly as it was, and any text before the first label is kept too.
 */

export type WritingPrompt = {
  /** Present only when the author used her labels. */
  sections: Array<{ label: string; text: string }>;
  /** The words to lean on, split from the "Опори" line. Empty when there is none. */
  props: string[];
  /** Everything that carried no label, including the whole task when none was used. */
  plain: string;
};

/**
 * Accepts all three apostrophes.
 *
 * Her files use the modifier letter (ʼ), a keyboard types the straight one, and a word
 * processor turns it into a curly one. Reading only the first would silently lose the section
 * the moment a task was edited somewhere else.
 */
const LABELS = [
  { key: 'situation', pattern: /^Ситуація\s*:/i },
  { key: 'task', pattern: /^Завдання\s*:/i },
  { key: 'must', pattern: /^Обов[ʼ'’]?\s*язково\s*:/i },
  { key: 'props', pattern: /^Опори\s*:/i },
] as const;

const matchLabel = (line: string) =>
  LABELS.find((label) => label.pattern.test(line.trim()));

/** The author separates the words to lean on with a middot, and sometimes with a comma. */
const splitProps = (value: string): string[] =>
  value
    .split(/\s+·\s+|\s+•\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const parseWritingPrompt = (task: string): WritingPrompt => {
  const lines = task.split('\n');
  const sections: Array<{ label: string; text: string }> = [];
  const plain: string[] = [];
  let props: string[] = [];
  /** Which section the lines after a label belong to, until the next one. */
  let current: { label: string; text: string[] } | null = null;

  const close = () => {
    if (!current) return;
    const text = current.text.join('\n').trim();
    if (current.label === 'Опори') props = splitProps(text);
    else if (text) sections.push({ label: current.label, text });
    current = null;
  };

  for (const line of lines) {
    const label = matchLabel(line);
    if (label) {
      close();
      const head = line.trim();
      current = {
        label: head.slice(0, head.indexOf(':')).trim(),
        text: [head.slice(head.indexOf(':') + 1).trim()],
      };
      continue;
    }
    if (current) current.text.push(line);
    else plain.push(line);
  }
  close();

  return { sections, props, plain: plain.join('\n').trim() };
};
