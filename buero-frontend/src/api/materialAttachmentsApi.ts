import axios from 'axios';
import { apiInstance } from '@/api/apiInstance';
import { API_ENDPOINTS } from '@/api/apiEndpoints';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';
import { stripJsonContentType } from '@/api/multipart';

export const fetchAttachments = async (
  courseId: string,
  moduleId: string,
  materialId: string,
) =>
  apiInstance.get<MaterialAttachment[]>(
    API_ENDPOINTS.courseMaterials.attachments(courseId, moduleId, materialId),
  );

export const uploadAttachment = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  file: File,
  title?: string,
) => {
  const formData = new FormData();
  formData.append('file', file);
  if (title?.trim()) formData.append('title', title.trim());
  return apiInstance.post<MaterialAttachment>(
    API_ENDPOINTS.courseMaterials.attachments(courseId, moduleId, materialId),
    formData,
    { transformRequest: stripJsonContentType },
  );
};

export const createLinkAttachment = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  body: { title: string; url: string },
) =>
  apiInstance.post<MaterialAttachment>(
    API_ENDPOINTS.courseMaterials.attachmentLink(courseId, moduleId, materialId),
    body,
  );

/**
 * Renames an attachment that is already saved.
 *
 * The name a file is stored under starts as the name it was uploaded with, and that is not
 * always a name worth showing a student - it may be a scan's serial number, or a name that
 * came through mangled from an older upload. Only the title changes; the file itself and
 * the name it downloads under stay as they are.
 */
export const renameAttachment = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  attachmentId: string,
  title: string,
) =>
  apiInstance.patch<MaterialAttachment>(
    API_ENDPOINTS.courseMaterials.attachmentById(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    ),
    { title: title.trim() },
  );

export const deleteAttachment = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  attachmentId: string,
) =>
  apiInstance.delete(
    API_ENDPOINTS.courseMaterials.attachmentById(
      courseId,
      moduleId,
      materialId,
      attachmentId,
    ),
  );

const messageFromJsonBlob = async (blob: Blob): Promise<string | null> => {
  try {
    const parsed = JSON.parse(await blob.text()) as { message?: string | string[] };
    if (Array.isArray(parsed.message)) return parsed.message.join(', ');
    if (typeof parsed.message === 'string' && parsed.message.trim()) return parsed.message;
  } catch {
    return null;
  }
  return null;
};

const saveBlob = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

export const downloadAttachmentFile = async (
  courseId: string,
  moduleId: string,
  materialId: string,
  attachmentId: string,
  fileName?: string | null,
) => {
  try {
    const res = await apiInstance.get<Blob>(
      API_ENDPOINTS.courseMaterials.attachmentDownload(
        courseId,
        moduleId,
        materialId,
        attachmentId,
      ),
      { responseType: 'blob' },
    );
    const blob = res.data;
    if (blob.type.includes('application/json')) {
      throw new Error((await messageFromJsonBlob(blob)) || 'Could not download the file');
    }
    saveBlob(blob, fileName?.trim() || 'attachment');
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data instanceof Blob) {
      const message = await messageFromJsonBlob(err.response.data);
      if (message) throw new Error(message);
    }
    throw err;
  }
};
