import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import React from 'react';

import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What a lesson's file is called, and who gets to decide.
 *
 * Two things came together here. A file is stored under the name it was uploaded with, and
 * that name is not always one worth showing a student - a scan's serial number, a draft
 * number, or a name that an older upload mangled on its way in, because multer decodes
 * upload filenames as `latin1` by default while browsers send UTF-8. So an all-ASCII name
 * arrived perfect and a Cyrillic one arrived as mojibake, with nothing to be done about it
 * from the editor.
 *
 * The charset is fixed at the upload (see `upload-keeps-the-filename.spec.ts` on the
 * server). This is the other half: the name is filled in from the file so nothing has to be
 * typed, and can be changed - before saving, or at any point afterwards.
 */
const uploadAttachment = vi.fn();
const renameAttachment = vi.fn();
const deleteAttachment = vi.fn();
const createLinkAttachment = vi.fn();
const fetchAttachments = vi.fn();

vi.mock('@/api/materialAttachmentsApi', () => ({
  fetchAttachments: (...a: unknown[]) => fetchAttachments(...a),
  uploadAttachment: (...a: unknown[]) => uploadAttachment(...a),
  renameAttachment: (...a: unknown[]) => renameAttachment(...a),
  deleteAttachment: (...a: unknown[]) => deleteAttachment(...a),
  createLinkAttachment: (...a: unknown[]) => createLinkAttachment(...a),
  downloadAttachmentFile: vi.fn(),
}));

const { default: CourseMaterialAttachmentsSection } = await import(
  '@/features/course-managment/components/CourseManagementWorkspace/courseMaterial/CourseMaterialAttachmentsSection'
);

const SAVED = {
  id: 'att-1',
  materialId: 'mat-1',
  kind: 'file' as const,
  title: 'Ð¨Ð¿Ð°Ñ€Ð³Ð°Ð»ÐºÐ°.pdf',
  url: 'https://cdn.example/x.pdf',
  fileName: 'Ð¨Ð¿Ð°Ñ€Ð³Ð°Ð»ÐºÐ°.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 641024,
  orderIndex: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
  fetchAttachments.mockResolvedValue({ data: [] });
  uploadAttachment.mockResolvedValue({ data: SAVED });
  renameAttachment.mockResolvedValue({ data: SAVED });
  deleteAttachment.mockResolvedValue({ data: {} });
});

const flushRef: React.MutableRefObject<(() => Promise<void>) | null> = { current: null };

const draw = () =>
  renderWithProviders(
    <CourseMaterialAttachmentsSection
      courseId="course-1"
      moduleId="module-1"
      materialId="mat-1"
      flushRef={flushRef}
    />,
  );

const pickFile = async (name: string) => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  const file = new File(['x'], name, { type: 'application/pdf' });
  await userEvent.upload(input, file);
  return file;
};

const save = async () => {
  await act(async () => {
    await flushRef.current?.();
  });
};

describe('a file being attached', () => {
  it('comes with its own name already filled in', async () => {
    draw();
    await waitFor(() => expect(fetchAttachments).toHaveBeenCalled());

    await pickFile('Шпаргалка A2.1.pdf');

    expect(await screen.findByDisplayValue('Шпаргалка A2.1.pdf')).toBeInTheDocument();
  });

  it('is saved under the name that was typed over it', async () => {
    draw();
    await waitFor(() => expect(fetchAttachments).toHaveBeenCalled());
    await pickFile('scan_0098371.pdf');

    const field = await screen.findByDisplayValue('scan_0098371.pdf');
    await userEvent.clear(field);
    await userEvent.type(field, 'Шпаргалка до уроку 1.1');
    await save();

    expect(uploadAttachment).toHaveBeenCalledWith(
      'course-1',
      'module-1',
      'mat-1',
      expect.any(File),
      'Шпаргалка до уроку 1.1',
    );
  });

  /** Clearing the box is not a request to have a file with no name. */
  it('falls back to the file name when the box is emptied', async () => {
    draw();
    await waitFor(() => expect(fetchAttachments).toHaveBeenCalled());
    await pickFile('scan_0098371.pdf');

    await userEvent.clear(await screen.findByDisplayValue('scan_0098371.pdf'));
    await save();

    expect(uploadAttachment).toHaveBeenCalledWith(
      'course-1',
      'module-1',
      'mat-1',
      expect.any(File),
      'scan_0098371.pdf',
    );
  });

  /** Renamed, it still has to be possible to tell which file it is. */
  it('keeps showing what the file is actually called', async () => {
    draw();
    await waitFor(() => expect(fetchAttachments).toHaveBeenCalled());
    await pickFile('scan_0098371.pdf');

    const field = await screen.findByDisplayValue('scan_0098371.pdf');
    await userEvent.clear(field);
    await userEvent.type(field, 'Шпаргалка');

    expect(screen.getByText(/scan_0098371\.pdf/)).toBeInTheDocument();
  });
});

describe('a file that is already saved', () => {
  /** The one on production right now, stored mangled before the charset was fixed. */
  it('can be renamed', async () => {
    fetchAttachments.mockResolvedValue({ data: [SAVED] });
    draw();

    const field = await screen.findByDisplayValue(SAVED.title);
    await userEvent.clear(field);
    await userEvent.type(field, 'Шпаргалка');
    await save();

    expect(renameAttachment).toHaveBeenCalledWith(
      'course-1',
      'module-1',
      'mat-1',
      'att-1',
      'Шпаргалка',
    );
  });

  /** Typing and typing back is not a change, so it should not become a request. */
  it('is left alone when the name ends up where it started', async () => {
    fetchAttachments.mockResolvedValue({ data: [SAVED] });
    draw();

    const field = await screen.findByDisplayValue(SAVED.title);
    await userEvent.type(field, 'x{backspace}');
    await save();

    expect(renameAttachment).not.toHaveBeenCalled();
  });

  it('keeps its name when the box is emptied rather than losing it', async () => {
    fetchAttachments.mockResolvedValue({ data: [SAVED] });
    draw();

    await userEvent.clear(await screen.findByDisplayValue(SAVED.title));
    await save();

    expect(renameAttachment).not.toHaveBeenCalled();
  });

  /** Renaming something on its way out would be a wasted request. */
  it('is not renamed when it is being removed', async () => {
    fetchAttachments.mockResolvedValue({ data: [SAVED] });
    draw();

    const field = await screen.findByDisplayValue(SAVED.title);
    await userEvent.clear(field);
    await userEvent.type(field, 'Шпаргалка');
    await userEvent.click(screen.getByLabelText(`Прибрати ${SAVED.title}`));
    await save();

    expect(renameAttachment).not.toHaveBeenCalled();
    expect(deleteAttachment).toHaveBeenCalled();
  });
});
