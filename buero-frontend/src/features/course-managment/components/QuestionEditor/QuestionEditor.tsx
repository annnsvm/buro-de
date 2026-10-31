import React, { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  createEditorElement,
  createEditorQuestion,
  deleteEditorElement,
  deleteEditorQuestion,
  fetchEditorElements,
  fetchEditorQuestions,
  updateEditorElement,
  updateEditorQuestion,
  uploadElementAudio,
  uploadElementAudioBatch,
  type EditorElement,
  type EditorQuestion,
  type PracticeBlockName,
  type SaveElementPayload,
  type SaveQuestionPayload,
} from '@/api/questionEditorApi';
import type { QuizQuestionType } from '@/api/quizApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import PracticeTexts from './PracticeTexts';
import PracticeAudios from './PracticeAudios';
import PracticeWritings from './PracticeWritings';
import PracticeSpeakings from './PracticeSpeakings';
import { usePersistentDraft } from '@/hooks/usePersistentDraft';

export type QuestionEditorProps = {
  courseId: string;
  moduleId: string;
  materialId: string;
  /**
   * True for a module test, where each task carries a weight. A lesson quiz counts
   * questions rather than points, so the weight is not offered there.
   */
  scoredByPoints: boolean;
  /**
   * True for a practice, whose questions belong to one of five blocks. A quiz and a test
   * have no blocks, so nothing about them is shown there.
   */
  hasBlocks?: boolean;
};

const BLOCK_LABELS: Record<PracticeBlockName, string> = {
  grammatik: 'Grammatik',
  lesen: 'Lesen',
  horen: 'Hören',
  sprechen: 'Sprechen',
  schreiben: 'Schreiben',
};

/** Which block's questions are asked about something, and what that something is. */
const BLOCKS_WITH_TEXTS: PracticeBlockName[] = ['lesen'];
const BLOCKS_WITH_AUDIO: PracticeBlockName[] = ['horen'];
/**
 * The two blocks that ask no questions at all.
 *
 * Writing is a rubric to be marked against; speaking is a prompt and the author's own answer.
 * Both were invisible in this editor until they had a view of their own: the tab showed a
 * question list, and an empty list of questions reads as an empty block even when nine
 * speaking tasks are sitting in it.
 */
const BLOCKS_WITH_WRITING: PracticeBlockName[] = ['schreiben'];
const BLOCKS_WITH_SPEAKING: PracticeBlockName[] = ['sprechen'];

const TYPE_LABELS: Record<QuizQuestionType, string> = {
  single_choice: 'Один варіант',
  multi_choice: 'Кілька варіантів',
  fill_blank: 'Вписати слово',
  text_input: 'Вписати речення',
  ordering: 'Порядок слів',
};

/**
 * Options get their id here rather than on the server. Without one there is nothing to
 * mark as correct, so a brand new question could never be saved: the answer key stayed
 * empty and the save was refused.
 */
const newOption = () => ({ id: crypto.randomUUID(), text: '' });

/**
 * A new question in a block with exactly one text is about that text.
 *
 * Leaving it unbound by default made forgetting the dropdown the likely outcome, and a
 * forgotten dropdown means the student answers questions about a text they were never shown.
 * Where there are two texts there is a real choice to make, so nothing is assumed.
 */
const blankQuestion = (
  block: PracticeBlockName,
  elements: EditorElement[] = [],
  elementId?: string,
): EditorQuestion => ({
  id: '',
  type: 'single_choice',
  prompt: '',
  accepted_answers: [],
  explanation: null,
  points: 1,
  skills: [],
  order_index: 0,
  block,
  element_id: elementId ?? (elements.length === 1 ? elements[0].id : null),
  options: [newOption(), newOption()],
  tokens: [],
});

/**
 * Editing the questions of a quiz on the platform.
 *
 * Questions arrive by import and are corrected here, so this works directly on the
 * questions rather than on a blob of JSON attached to the material. The server
 * refuses a question a student could not answer, and the reason is shown here rather
 * than the save quietly doing nothing.
 */
const QuestionEditor: React.FC<QuestionEditorProps> = ({
  courseId,
  moduleId,
  materialId,
  scoredByPoints,
  hasBlocks = false,
}) => {
  const [questions, setQuestions] = useState<EditorQuestion[]>([]);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Which block is being worked on. A quiz has none, and everything stays in grammatik. */
  const [block, setBlock] = useState<PracticeBlockName>('grammatik');
  /**
   * A question being written survives this editor being closed and reopened.
   *
   * Scoped to the material and the block. A question carries the block it belongs to, and the
   * form is drawn whenever there is a draft at all, so one key per block is what keeps a
   * half-written Hoeren question from appearing under Grammatik.
   */
  const {
    value: draft,
    setValue: setDraft,
    clear: forgetDraft,
  } = usePersistentDraft<EditorQuestion | null>(
    `question:${materialId}:${block}`,
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedQuestions, loadedElements] = await Promise.all([
        fetchEditorQuestions(courseId, moduleId, materialId),
        hasBlocks
          ? fetchEditorElements(courseId, moduleId, materialId)
          : Promise.resolve([] as EditorElement[]),
      ]);
      setQuestions(loadedQuestions);
      setElements(loadedElements);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Не вдалося завантажити питання'));
    } finally {
      setLoading(false);
    }
  }, [courseId, moduleId, materialId, hasBlocks]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      const payload: SaveQuestionPayload = {
        type: draft.type,
        prompt: draft.prompt,
        accepted_answers: draft.accepted_answers,
        explanation: draft.explanation ?? undefined,
        points: draft.points,
        ...(hasBlocks
          ? {
              block: draft.block,
              ...(draft.element_id ? { element_id: draft.element_id } : {}),
            }
          : {}),
        ...(draft.type === 'single_choice' || draft.type === 'multi_choice'
          ? { options: draft.options }
          : {}),
        ...(draft.type === 'ordering' ? { tokens: draft.tokens } : {}),
      };
      if (draft.id) {
        await updateEditorQuestion(courseId, moduleId, materialId, draft.id, payload);
      } else {
        await createEditorQuestion(courseId, moduleId, materialId, payload);
      }
      setDraft(null);
      /** Saved, so there is nothing left to protect. */
      forgetDraft();
      await load();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Не вдалося зберегти питання'));
    } finally {
      setSaving(false);
    }
  }, [draft, courseId, moduleId, materialId, load, hasBlocks]);

  const remove = useCallback(
    async (questionId: string) => {
      setError(null);
      try {
        await deleteEditorQuestion(courseId, moduleId, materialId, questionId);
        await load();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося видалити питання'));
      }
    },
    [courseId, moduleId, materialId, load],
  );

  const saveElement = useCallback(
    async (elementId: string | null, payload: SaveElementPayload) => {
      setSaving(true);
      setError(null);
      try {
        if (elementId) {
          await updateEditorElement(courseId, moduleId, materialId, elementId, payload);
        } else {
          await createEditorElement(courseId, moduleId, materialId, payload);
        }
        await load();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося зберегти текст'));
      } finally {
        setSaving(false);
      }
    },
    [courseId, moduleId, materialId, load],
  );

  const uploadAudio = useCallback(
    async (elementId: string, file: File) => {
      setError(null);
      try {
        await uploadElementAudio(courseId, moduleId, materialId, elementId, file);
        await load();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося завантажити аудіо'));
      }
    },
    [courseId, moduleId, materialId, load],
  );

  /**
   * The result is reported rather than swallowed: a file that matched nothing is nearly always
   * a typo in one of the two names, and the author can only see that if it is said.
   */
  const uploadAudioBatch = useCallback(
    async (files: File[]) => {
      setError(null);
      try {
        const result = await uploadElementAudioBatch(courseId, moduleId, materialId, files);
        await load();
        const notes: string[] = [`Завантажено: ${result.uploaded}`];
        if (result.unmatched.length) {
          notes.push(`не зіставлено: ${result.unmatched.join(', ')}`);
        }
        if (result.still_missing.length) {
          notes.push(`ще бракує: ${result.still_missing.join(', ')}`);
        }
        if (result.unmatched.length || result.still_missing.length) {
          setError(notes.join('. '));
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося завантажити аудіо'));
      }
    },
    [courseId, moduleId, materialId, load],
  );

  const removeElement = useCallback(
    async (elementId: string) => {
      setError(null);
      try {
        await deleteEditorElement(courseId, moduleId, materialId, elementId);
        await load();
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося видалити текст'));
      }
    },
    [courseId, moduleId, materialId, load],
  );

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
        Завантаження питань…
      </p>
    );
  }

  /** A quiz has one undivided list; a practice shows one block at a time. */
  const shown = hasBlocks ? questions.filter((question) => question.block === block) : questions;
  const blockElements = elements.filter((element) => element.block === block);

  return (
    <div className="space-y-4">
      {hasBlocks ? (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(BLOCK_LABELS) as PracticeBlockName[]).map((name) => {
            /**
             * How much is in the block: its questions where it asks them, its tasks where it
             * does not. Counting questions alone badged Schreiben and Sprechen 0 while the
             * letters and recordings sat inside them - a plain untruth on the one tab whose
             * contents are hardest to find any other way.
             */
            const asked = questions.filter((question) => question.block === name).length;
            const count =
              asked || elements.filter((element) => element.block === name).length;
            return (
              <button
                key={name}
                type="button"
                /**
                 * Only the block changes. This used to discard the question being written,
                 * which is the loss the author reported: one click on another block and a
                 * typed-out question was gone. The draft key carries the block, so switching
                 * now puts the other block's draft on screen and keeps this one waiting.
                 */
                onClick={() => setBlock(name)}
                className={[
                  'rounded-full px-4 py-1.5 text-sm font-medium transition',
                  name === block
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'border border-[var(--color-border-default)] text-[var(--color-text-secondary)]',
                ].join(' ')}
              >
                {BLOCK_LABELS[name]}
                {/* The count is a badge on the tab, not more words in its name. */}
                <span
                  className={[
                    'ml-2 rounded-full px-2 py-0.5 text-xs tabular-nums',
                    name === block
                      ? 'bg-white/25'
                      : 'bg-[var(--color-surface-section)] text-[var(--color-text-secondary)]',
                  ].join(' ')}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {hasBlocks && BLOCKS_WITH_AUDIO.includes(block) ? (
        <PracticeAudios
          block={block}
          draftKey={`element:${materialId}:${block}`}
          elements={blockElements}
          saving={saving}
          onSave={saveElement}
          onDelete={removeElement}
          onUploadAudio={uploadAudio}
          onUploadBatch={uploadAudioBatch}
          onAddQuestion={(elementId) => setDraft(blankQuestion(block, blockElements, elementId))}
        />
      ) : null}

      {hasBlocks && BLOCKS_WITH_WRITING.includes(block) ? (
        <PracticeWritings
          block={block}
          draftKey={`element:${materialId}:${block}`}
          elements={blockElements}
          saving={saving}
          onSave={saveElement}
          onDelete={removeElement}
        />
      ) : null}

      {hasBlocks && BLOCKS_WITH_SPEAKING.includes(block) ? (
        <PracticeSpeakings
          block={block}
          draftKey={`element:${materialId}:${block}`}
          elements={blockElements}
          saving={saving}
          onSave={saveElement}
          onDelete={removeElement}
        />
      ) : null}

      {hasBlocks && BLOCKS_WITH_TEXTS.includes(block) ? (
        <PracticeTexts
          block={block}
          draftKey={`element:${materialId}:${block}`}
          elements={blockElements}
          saving={saving}
          onSave={saveElement}
          onDelete={removeElement}
          onAddQuestion={(elementId) => setDraft(blankQuestion(block, blockElements, elementId))}
        />
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-secondary)]">Питань у квізі: {shown.length}</p>
        <button
          type="button"
          onClick={() => setDraft(blankQuestion(block, blockElements))}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white"
        >
          Додати питання
        </button>
      </div>

      {error ? (
        <p className="text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {draft ? (
        <QuestionForm
          draft={draft}
          saving={saving}
          scoredByPoints={scoredByPoints}
          elements={blockElements}
          onChange={setDraft}
          onCancel={() => {
            setDraft(null);
            forgetDraft();
          }}
          onSave={() => void save()}
        />
      ) : null}

      <ul className="space-y-2">
        {shown.map((question, index) => (
          <li
            key={question.id}
            className="rounded-xl border border-[var(--color-border-default)] p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => setDraft(question)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="flex flex-wrap items-center gap-x-3 text-[0.7rem] font-bold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase">
                  {/* Zero-padded, so a list of ten questions keeps one column. */}
                  <span className="tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  <span>{TYPE_LABELS[question.type]}</span>
                  {scoredByPoints && question.points > 1 ? (
                    <span className="rounded-full bg-[var(--color-dawn-pink-light)] px-2.5 py-0.5 text-[var(--color-burnt-siena-dark)]">
                      {question.points} бали
                    </span>
                  ) : null}
                </span>
                <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                  {question.prompt || '-'}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Відповідь: {answerLabel(question)}
                </p>
              </button>
              <button
                type="button"
                aria-label={`Видалити питання ${index + 1}`}
                onClick={() => void remove(question.id)}
                className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {shown.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
          Питань ще немає. Завантажте їх із CSV або додайте вручну.
        </p>
      ) : null}
    </div>
  );
};

/** Shows the answer key the way the author wrote it, not as internal option ids. */
const answerLabel = (question: EditorQuestion): string => {
  if (question.type === 'single_choice' || question.type === 'multi_choice') {
    const byId = new Map(question.options.map((option) => [option.id, option.text]));
    return question.accepted_answers
      .map((accepted) =>
        accepted
          .split(',')
          .map((id) => byId.get(id.trim()) ?? id.trim())
          .join(', '),
      )
      .join(' / ');
  }
  return question.accepted_answers.join(' / ');
};

const QuestionForm: React.FC<{
  draft: EditorQuestion;
  saving: boolean;
  scoredByPoints: boolean;
  /** The texts of this block, to pick which one the question is about. */
  elements: EditorElement[];
  onChange: (draft: EditorQuestion) => void;
  onCancel: () => void;
  onSave: () => void;
}> = ({ draft, saving, scoredByPoints, elements, onChange, onCancel, onSave }) => {
  const isChoice = draft.type === 'single_choice' || draft.type === 'multi_choice';

  return (
    <div className="space-y-3 rounded-xl bg-[var(--color-surface-section)] p-4">
      <label className="block text-sm">
        Тип
        <select
          value={draft.type}
          onChange={(event) =>
            onChange({
              ...draft,
              type: event.target.value as QuizQuestionType,
              // The answer key means something different per type, so it is cleared.
              accepted_answers: [],
            })
          }
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        >
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {/* Offered only where there is something to pick: Grammatik has no texts at all. */}
      {elements.length > 0 ? (
        <label className="block text-sm">
          Про який текст це питання
          <select
            value={draft.element_id ?? ''}
            onChange={(event) => onChange({ ...draft, element_id: event.target.value || null })}
            className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          >
            <option value="">Без тексту</option>
            {elements.map((element) => (
              <option key={element.id} value={element.id}>
                {element.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="block text-sm">
        Питання
        <textarea
          value={draft.prompt}
          onChange={(event) => onChange({ ...draft, prompt: event.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      {isChoice ? (
        <fieldset className="space-y-2 text-sm">
          <legend>Варіанти - позначте правильні</legend>
          {draft.options.map((option, index) => {
            const key = option.id || `option-${index}`;
            const selected = draft.accepted_answers
              .flatMap((accepted) => accepted.split(','))
              .map((value) => value.trim())
              .includes(option.id);
            return (
              <div key={key} className="flex items-center gap-2">
                <input
                  type={draft.type === 'multi_choice' ? 'checkbox' : 'radio'}
                  name="correct-option"
                  checked={selected}
                  onChange={() => {
                    if (draft.type === 'single_choice') {
                      onChange({ ...draft, accepted_answers: [option.id] });
                      return;
                    }
                    const chosen = new Set(
                      draft.accepted_answers.flatMap((accepted) =>
                        accepted.split(',').map((value) => value.trim()),
                      ),
                    );
                    if (chosen.has(option.id)) chosen.delete(option.id);
                    else chosen.add(option.id);
                    onChange({
                      ...draft,
                      accepted_answers: chosen.size ? [[...chosen].sort().join(',')] : [],
                    });
                  }}
                  className="accent-[var(--color-primary)]"
                />
                <input
                  type="text"
                  value={option.text}
                  onChange={(event) => {
                    const options = [...draft.options];
                    options[index] = { ...option, text: event.target.value };
                    onChange({ ...draft, options });
                  }}
                  className="flex-1 rounded-lg border border-[var(--color-border-default)] px-3 py-2"
                />
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => onChange({ ...draft, options: [...draft.options, newOption()] })}
            className="text-xs text-[var(--color-primary)]"
          >
            Додати варіант
          </button>
        </fieldset>
      ) : (
        <label className="block text-sm">
          Правильні відповіді - кожна з нового рядка
          <textarea
            value={draft.accepted_answers.join('\n')}
            onChange={(event) =>
              onChange({
                ...draft,
                accepted_answers: event.target.value.split('\n'),
              })
            }
            rows={3}
            className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
      )}

      {draft.type === 'ordering' ? (
        <label className="block text-sm">
          Слова для впорядкування - через кому
          <input
            type="text"
            value={draft.tokens.join(', ')}
            onChange={(event) =>
              onChange({
                ...draft,
                tokens: event.target.value.split(',').map((token) => token.trim()),
              })
            }
            className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
      ) : null}

      <label className="block text-sm">
        Пояснення - показується студенту після відповіді
        <textarea
          value={draft.explanation ?? ''}
          onChange={(event) => onChange({ ...draft, explanation: event.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-[var(--color-border-default)] px-3 py-2"
        />
      </label>

      {/* Only a test is counted in points; in a lesson quiz the field would do nothing. */}
      {scoredByPoints ? (
        <label className="block text-sm">
          Бали за завдання
          <input
            type="number"
            min={1}
            value={draft.points}
            onChange={(event) =>
              onChange({ ...draft, points: Math.max(1, Number(event.target.value)) })
            }
            className="mt-1 block w-24 rounded-lg border border-[var(--color-border-default)] px-3 py-2"
          />
        </label>
      ) : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Зберігаємо…' : 'Зберегти питання'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-[var(--color-border-default)] px-5 py-2 text-sm"
        >
          Скасувати
        </button>
      </div>
    </div>
  );
};

export default QuestionEditor;
