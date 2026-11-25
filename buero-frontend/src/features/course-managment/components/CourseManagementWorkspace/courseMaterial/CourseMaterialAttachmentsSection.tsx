import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, FileText, Image, Link as LinkIcon, Trash2 } from 'lucide-react';

import {
  createLinkAttachment,
  deleteAttachment,
  downloadAttachmentFile,
  fetchAttachments,
  renameAttachment,
  uploadAttachment,
} from '@/api/materialAttachmentsApi';
import { Button, FormField, Input, Spinner } from '@/components/ui';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
];

const ACCEPT =
  '.pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx,.xls,.xlsx,.txt,.zip,application/pdf,image/jpeg,image/png,image/webp,image/gif';

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Editable, but not loud about it: transparent until hovered or focused, so a column of
 * files still reads as a list of files rather than as a form to fill in.
 */
const NAME_INPUT =
  'w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)] focus:border-[var(--color-border-subtle)] focus:bg-[var(--color-neutral-white)] focus:outline-none disabled:opacity-60';

const formatSize = (bytes: number | null | undefined): string => {
  if (bytes == null || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
};

const attachmentIcon = (item: { kind: string; mimeType?: string | null }) => {
  if (item.kind === 'link') return LinkIcon;
  if (item.mimeType?.startsWith('image/')) return Image;
  return FileText;
};

type PendingAdd =
  | { draftId: string; kind: 'file'; file: File; title: string }
  | { draftId: string; kind: 'link'; title: string; url: string };

/**
 * The name shown to the student, which is not always the name the file arrived with.
 *
 * A file comes called whatever the author's folder called it - a scan's serial number, a
 * draft number, or a name that an older upload mangled on its way in. The upload fills
 * this in from the file so nothing has to be typed, and it can be changed before saving or
 * at any point afterwards. The file itself, and the name it downloads under, do not change.
 */
const titleFromFileName = (fileName: string): string => fileName.trim();

export type CourseMaterialAttachmentsSectionProps = {
  courseId: string;
  moduleId: string;
  materialId: string;
  onDraftChange?: (hasDraft: boolean) => void;
  flushRef?: React.MutableRefObject<(() => Promise<void>) | null>;
};

const CourseMaterialAttachmentsSection: React.FC<CourseMaterialAttachmentsSectionProps> = ({
  courseId,
  moduleId,
  materialId,
  onDraftChange,
  flushRef,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [savedItems, setSavedItems] = useState<MaterialAttachment[]>([]);
  const [pendingAdds, setPendingAdds] = useState<PendingAdd[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  /** Renames of already-saved attachments, applied with everything else on confirm. */
  const [pendingRenames, setPendingRenames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFlushing, setIsFlushing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const pendingAddsRef = useRef(pendingAdds);
  const pendingDeleteIdsRef = useRef(pendingDeleteIds);
  const pendingRenamesRef = useRef(pendingRenames);
  pendingAddsRef.current = pendingAdds;
  pendingDeleteIdsRef.current = pendingDeleteIds;
  pendingRenamesRef.current = pendingRenames;

  const hasDraft =
    pendingAdds.length > 0 ||
    pendingDeleteIds.length > 0 ||
    Object.keys(pendingRenames).length > 0;

  useEffect(() => {
    onDraftChange?.(hasDraft);
  }, [hasDraft, onDraftChange]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAttachments(courseId, moduleId, materialId);
      setSavedItems(res.data);
      setPendingAdds([]);
      setPendingDeleteIds([]);
      setPendingRenames({});
    } catch (err) {
      setError(getErrorMessage(err, 'Не вдалося завантажити файли уроку'));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, moduleId, materialId]);

  useEffect(() => {
    void load();
  }, [load]);

  const flushDrafts = useCallback(async () => {
    const adds = pendingAddsRef.current;
    const deletes = pendingDeleteIdsRef.current;
    const renames = Object.entries(pendingRenamesRef.current);
    if (adds.length === 0 && deletes.length === 0 && renames.length === 0) return;

    setIsFlushing(true);
    setError(null);
    try {
      for (const add of adds) {
        if (add.kind === 'file') {
          /** Cleared to nothing, so fall back to what the file is actually called. */
          await uploadAttachment(
            courseId,
            moduleId,
            materialId,
            add.file,
            add.title.trim() || add.file.name,
          );
        } else {
          await createLinkAttachment(courseId, moduleId, materialId, {
            title: add.title,
            url: add.url,
          });
        }
      }
      for (const [attachmentId, title] of renames) {
        /** Deleting wins: renaming something on its way out would be a wasted request. */
        if (deletes.includes(attachmentId)) continue;
        /** Cleared to nothing: leave the name it already has rather than wipe it. */
        if (!title.trim()) continue;
        await renameAttachment(courseId, moduleId, materialId, attachmentId, title);
      }
      for (const attachmentId of deletes) {
        await deleteAttachment(courseId, moduleId, materialId, attachmentId);
      }
      await load();
    } catch (err) {
      setError(getErrorMessage(err, 'Не вдалося зберегти файли уроку'));
      throw err;
    } finally {
      setIsFlushing(false);
    }
  }, [courseId, load, materialId, moduleId]);

  useEffect(() => {
    if (!flushRef) return;
    flushRef.current = flushDrafts;
    return () => {
      flushRef.current = null;
    };
  }, [flushDrafts, flushRef]);

  const handlePickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError('Файл завеликий - максимум 10 МБ.');
      return;
    }
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Такий тип файлу не підходить. Можна: PDF, зображення, Word, Excel, TXT, ZIP.');
      return;
    }
    setError(null);
    setPendingAdds((prev) => [
      ...prev,
      {
        draftId: crypto.randomUUID(),
        kind: 'file',
        file,
        title: titleFromFileName(file.name),
      },
    ]);
  };

  const handleAddLink = () => {
    const title = linkTitle.trim();
    const url = linkUrl.trim();
    if (!title || !url) {
      setError('Потрібні і назва, і адреса');
      return;
    }
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      setError('Адреса має починатися з https://');
      return;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      setError('Адреса має починатися з https://');
      return;
    }
    setError(null);
    setPendingAdds((prev) => [...prev, { draftId: crypto.randomUUID(), kind: 'link', title, url }]);
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleDownload = async (item: MaterialAttachment) => {
    if (item.kind === 'link') {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      return;
    }
    setDownloadingId(item.id);
    setError(null);
    try {
      await downloadAttachmentFile(courseId, moduleId, materialId, item.id, item.fileName || item.title);
    } catch (err) {
      setError(getErrorMessage(err, 'Не вдалося завантажити файл'));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRemoveSaved = (attachmentId: string) => {
    setError(null);
    setPendingDeleteIds((prev) => (prev.includes(attachmentId) ? prev : [...prev, attachmentId]));
  };

  const handleUndoRemove = (attachmentId: string) => {
    setPendingDeleteIds((prev) => prev.filter((id) => id !== attachmentId));
  };

  const handleRenamePending = (draftId: string, title: string) => {
    setPendingAdds((prev) =>
      prev.map((item) => (item.draftId === draftId ? { ...item, title } : item)),
    );
  };

  /**
   * Kept as a pending change rather than sent on every keystroke, so a rename lands with
   * the rest of the lesson on confirm - and typing over a name does not fire a request per
   * letter. Going back to the saved name simply drops the change.
   */
  const handleRenameSaved = (item: MaterialAttachment, title: string) => {
    setPendingRenames((prev) => {
      const next = { ...prev };
      if (title.trim() === item.title.trim()) delete next[item.id];
      else next[item.id] = title;
      return next;
    });
  };

  const handleRemovePending = (draftId: string) => {
    setPendingAdds((prev) => prev.filter((item) => item.draftId !== draftId));
  };

  const busy = isFlushing;

  return (
    <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-6">
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Файли уроку</p>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        Необов’язково. Файли й посилання збережуться лише після «Зберегти зміни» → «Підтвердити».
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={handlePickFile}
        disabled={busy}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outlineDark"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          Завантажити файл
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <FormField label="Назва посилання" name="attachmentLinkTitle">
          <Input
            id="attachmentLinkTitle"
            placeholder="Напр. Додаткове читання"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            disabled={busy}
          />
        </FormField>
        <FormField label="Адреса посилання" name="attachmentLinkUrl">
          <Input
            id="attachmentLinkUrl"
            placeholder="https://"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            disabled={busy}
          />
        </FormField>
        <Button type="button" variant="solid" onClick={handleAddLink} disabled={busy}>
          Додати посилання
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <Spinner className="size-4" />
          Завантажуємо файли
        </div>
      ) : savedItems.length === 0 && pendingAdds.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-text-secondary)]">Файлів для цього уроку поки немає.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {savedItems.map((item) => {
            const IconCmp = attachmentIcon(item);
            const sizeLabel = formatSize(item.sizeBytes);
            const willRemove = pendingDeleteIds.includes(item.id);
            return (
              <li
                key={item.id}
                className={`flex items-center gap-3 rounded-lg border border-[var(--color-border-subtle)] px-3 py-2 ${
                  willRemove ? 'opacity-60' : ''
                }`}
              >
                <IconCmp className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  {willRemove ? (
                    <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                      {item.title}
                    </p>
                  ) : (
                    <input
                      value={pendingRenames[item.id] ?? item.title}
                      onChange={(event) => handleRenameSaved(item, event.target.value)}
                      disabled={busy}
                      aria-label={`Назва файлу: ${item.title}`}
                      className={NAME_INPUT}
                    />
                  )}
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">
                    {willRemove
                      ? 'Зникне після підтвердження'
                      : item.kind === 'link'
                        ? item.url
                        : [item.fileName, sizeLabel].filter(Boolean).join(', ')}
                  </p>
                </div>
                {willRemove ? (
                  <button
                    type="button"
                    onClick={() => handleUndoRemove(item.id)}
                    disabled={busy}
                    className="rounded px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                  >
                    Повернути
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label={item.kind === 'link' ? `Відкрити ${item.title}` : `Завантажити ${item.title}`}
                      onClick={() => void handleDownload(item)}
                      disabled={busy || downloadingId === item.id}
                      className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                    >
                      {item.kind === 'link' ? (
                        <LinkIcon className="h-4 w-4" aria-hidden />
                      ) : (
                        <Download className="h-4 w-4" aria-hidden />
                      )}
                    </button>
                    <button
                      type="button"
                      aria-label={`Прибрати ${item.title}`}
                      onClick={() => handleRemoveSaved(item.id)}
                      disabled={busy}
                      className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </>
                )}
              </li>
            );
          })}
          {pendingAdds.map((item) => {
            const IconCmp = attachmentIcon({
              kind: item.kind,
              mimeType: item.kind === 'file' ? item.file.type : null,
            });
            const title = item.kind === 'file' ? item.file.name : item.title;
            /** The file's own name stays visible, so a renamed row still says what it is. */
            const detail =
              item.kind === 'file'
                ? [item.file.name, formatSize(item.file.size), 'ще не збережено']
                    .filter(Boolean)
                    .join(', ')
                : `${item.url}, ще не збережено`;
            return (
              <li
                key={item.draftId}
                className="flex items-center gap-3 rounded-lg border border-dashed border-[var(--color-border-subtle)] px-3 py-2"
              >
                <IconCmp className="h-4 w-4 shrink-0 text-[var(--color-text-secondary)]" aria-hidden />
                <div className="min-w-0 flex-1">
                  {item.kind === 'file' ? (
                    <input
                      value={item.title}
                      onChange={(event) => handleRenamePending(item.draftId, event.target.value)}
                      disabled={busy}
                      aria-label={`Назва файлу: ${item.file.name}`}
                      className={NAME_INPUT}
                    />
                  ) : (
                    <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                      {title}
                    </p>
                  )}
                  <p className="truncate text-xs text-[var(--color-text-secondary)]">{detail}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Прибрати ${title}`}
                  onClick={() => handleRemovePending(item.draftId)}
                  disabled={busy}
                  className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-section)] disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CourseMaterialAttachmentsSection;
