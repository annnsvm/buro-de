import React, { useCallback, useState } from 'react';
import { BaseDialog, ModalBody } from '@/components/modal';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import {
  importQuestions,
  type ImportMode,
  type ImportPreview,
} from '@/api/questionImportApi';

export type ImportQuestionsModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  onImported: () => void;
};

/**
 * Loads a module's questions from the author's CSV.
 *
 * Nothing is written until the file has been read back to the author: how many
 * questions, split into which quizzes, of which types, and which rows could not be
 * used. A file with a typo in it should be caught here rather than discovered by a
 * student halfway through a lesson.
 */
const ImportQuestionsModal: React.FC<ImportQuestionsModalProps> = ({
  isOpen,
  handleOpenChange,
  courseId,
  moduleId,
  moduleTitle,
  onImported,
}) => {
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [mode, setMode] = useState<ImportMode>('practice');
  const [passingScore, setPassingScore] = useState(60);
  const [acceptAlternatives, setAcceptAlternatives] = useState(true);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<ImportPreview | null>(null);

  const reset = useCallback(() => {
    setCsv('');
    setFileName('');
    setPreview(null);
    setDone(null);
    setError(null);
  }, []);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setPreview(null);
    setDone(null);
    setFileName(file.name);
    setCsv(await file.text());
  };

  const run = useCallback(
    async (dryRun: boolean) => {
      if (!csv) return;
      setBusy(true);
      setError(null);
      try {
        const result = await importQuestions(courseId, moduleId, {
          csv,
          mode,
          dry_run: dryRun,
          ...(mode === 'test' && { passing_score: passingScore }),
          accept_alternatives: acceptAlternatives,
        });
        if (dryRun) {
          setPreview(result);
        } else {
          setDone(result);
          onImported();
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err, 'Не вдалося прочитати файл'));
      } finally {
        setBusy(false);
      }
    },
    [csv, courseId, moduleId, mode, passingScore, acceptAlternatives, onImported],
  );

  const close = () => {
    reset();
    handleOpenChange(false);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => (open ? handleOpenChange(true) : close())}
      openCloseAnimation
      contentClassName="relative z-[1] w-[min(94vw,640px)] max-h-[85vh] overflow-y-auto rounded-2xl bg-[var(--color-neutral-white)] p-6 focus:outline-none sm:p-8"
    >
      <ModalBody>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Імпорт питань
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Модуль: {moduleTitle}
        </p>

        {done ? (
          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-[var(--color-success-text)]">
              Готово: створено {done.created ?? 0}, оновлено {done.updated ?? 0} квізів,
              усього {done.totalQuestions} питань.
            </p>
            <button
              type="button"
              onClick={close}
              className="w-full rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white"
            >
              Закрити
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Файл CSV
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => void handleFile(event.target.files?.[0])}
                  className="mt-1 block w-full text-sm text-[var(--color-text-secondary)]"
                />
                {fileName ? (
                  <span className="mt-1 block text-xs text-[var(--color-text-secondary)]">
                    {fileName}
                  </span>
                ) : null}
              </label>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-[var(--color-text-primary)]">
                  Що імпортуємо
                </legend>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="import-mode"
                    checked={mode === 'practice'}
                    onChange={() => setMode('practice')}
                    className="accent-[var(--color-primary)]"
                  />
                  Квізи уроків — по одному на кожен урок із колонки «Урок»
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="import-mode"
                    checked={mode === 'test'}
                    onChange={() => setMode('test')}
                    className="accent-[var(--color-primary)]"
                  />
                  Підсумковий тест модуля — увесь файл одним матеріалом
                </label>
              </fieldset>

              {mode === 'test' ? (
                <label className="flex items-center gap-2 text-sm">
                  Відсоток для зарахування
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={passingScore}
                    onChange={(event) => setPassingScore(Number(event.target.value))}
                    className="w-20 rounded-lg border border-[var(--color-border-default)] px-2 py-1"
                  />
                </label>
              ) : null}

              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={acceptAlternatives}
                  onChange={(event) => setAcceptAlternatives(event.target.checked)}
                  className="mt-1 accent-[var(--color-primary)]"
                />
                <span>
                  Зараховувати формулювання, які згадані в поясненні як прийнятні
                  <span className="block text-xs text-[var(--color-text-secondary)]">
                    Їх видно у попередньому перегляді — перевірте перед імпортом
                  </span>
                </span>
              </label>
            </div>

            {error ? (
              <p className="mt-4 text-sm text-[var(--color-error)]" role="alert">
                {error}
              </p>
            ) : null}

            {preview ? <Preview preview={preview} /> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void run(true)}
                disabled={!csv || busy}
                className="flex-1 rounded-full border border-[var(--color-border-default)] px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] disabled:opacity-50"
              >
                {busy && !preview ? 'Читаємо…' : 'Перевірити файл'}
              </button>
              <button
                type="button"
                onClick={() => void run(false)}
                disabled={!preview || busy || preview.totalQuestions === 0}
                className="flex-1 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
              >
                {busy ? 'Імпортуємо…' : 'Імпортувати'}
              </button>
            </div>
          </>
        )}
      </ModalBody>
    </BaseDialog>
  );
};

const Preview: React.FC<{ preview: ImportPreview }> = ({ preview }) => (
  <div className="mt-6 space-y-4 rounded-xl bg-[var(--color-surface-section)] p-4">
    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
      Буде імпортовано {preview.totalQuestions} питань у {preview.targets.length} квіз(ів)
    </p>

    <ul className="space-y-2">
      {preview.targets.map((target) => (
        <li key={target.title} className="text-sm">
          <span className="font-medium text-[var(--color-text-primary)]">
            {target.title}
          </span>
          <span className="text-[var(--color-text-secondary)]">
            {' '}
            — {target.questionCount} питань, {target.points} балів
            {target.existingMaterialId ? ' · оновиться' : ' · новий'}
          </span>
          {target.alternatives.length > 0 ? (
            <ul className="mt-1 ml-4 list-disc text-xs text-[var(--color-text-secondary)]">
              {target.alternatives.map((alternative) => (
                <li key={alternative.id}>
                  {alternative.id}: також приймається «{alternative.wordings[0]}»
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>

    {preview.problems.length > 0 ? (
      <div>
        <p className="text-sm font-semibold text-[var(--color-error)]">
          Рядки, які не вдалося прочитати ({preview.problems.length})
        </p>
        <ul className="mt-1 ml-4 list-disc text-xs text-[var(--color-text-secondary)]">
          {preview.problems.map((problem) => (
            <li key={`${problem.row}-${problem.id}`}>
              рядок {problem.row} {problem.id ? `[${problem.id}]` : ''} — {problem.message}
            </li>
          ))}
        </ul>
      </div>
    ) : null}

    {preview.unusable.length > 0 ? (
      <div>
        <p className="text-sm font-semibold text-[var(--color-error)]">
          Питання, які студент не зможе пройти ({preview.unusable.length})
        </p>
        <ul className="mt-1 ml-4 list-disc text-xs text-[var(--color-text-secondary)]">
          {preview.unusable.map((entry) => (
            <li key={entry.id}>
              {entry.id} — {entry.reasons.join('; ')}
            </li>
          ))}
        </ul>
      </div>
    ) : null}
  </div>
);

export default ImportQuestionsModal;
