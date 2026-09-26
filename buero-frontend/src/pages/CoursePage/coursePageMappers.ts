import type { CourseModule } from '@/features/courses-catalog/CourseStructure';
import type { LearningLesson } from '@/types/features/learning/LearningPage.types';
import type { MaterialAttachment } from '@/types/features/courseManagment/MaterialAttachment.types';
import i18n from '@/i18n';

export type ApiMaterialAttachment = {
  id: string;
  kind?: string;
  title?: string;
  url?: string;
  fileName?: string | null;
  file_name?: string | null;
  mimeType?: string | null;
  mime_type?: string | null;
  sizeBytes?: number | null;
  size_bytes?: number | null;
  orderIndex?: number;
};

export type ApiCourseMaterial = {
  id: string;
  title: string;
  type: string;
  orderIndex?: number;
  /** Always served, even for locked lessons, so the lesson list stays informative. */
  duration?: string | null;
  /** True when the server withheld `content` because the viewer has no access. */
  locked?: boolean;
  content?: Record<string, unknown> | null;
  /**
   * On a quiz material: the practice after a lesson, or the test after a module. The
   * player needs it to know where finishing leads — the next lesson, or the next module.
   */
  quizMode?: 'practice' | 'test' | null;
  attachments?: ApiMaterialAttachment[];
};

export type ApiCourseModule = {
  id: string;
  title: string;
  orderIndex?: number;
  materials?: ApiCourseMaterial[];
};

export type ApiCourseMyAccess = {
  access_type?: string;
  /** Kept for older responses; trial_module_ids is the authoritative list. */
  first_module_id?: string;
  trial_module_ids?: string[];
};

export type ApiCourseWithTree = {
  id: string;
  title: string;
  description?: string | null;
  /** Full course price; shown to trial students on the unlock call to action. */
  price?: number | null;
  modules?: ApiCourseModule[];
  my_access?: ApiCourseMyAccess;
};

/**
 * Narrows a course preview to the modules a trial opens. The server sends the list,
 * so the catalog shows exactly what the learner would get rather than guessing.
 */
export const applyTrialModuleScope = (course: ApiCourseWithTree): ApiCourseWithTree => {
  const access = course.my_access;
  if (!access || access.access_type !== 'trial') return course;
  const modules = course.modules ?? [];
  const fallbackId = access.first_module_id ?? modules[0]?.id;
  const targetIds = access.trial_module_ids?.length
    ? access.trial_module_ids
    : fallbackId
      ? [fallbackId]
      : [];
  if (!targetIds.length) return { ...course, modules: [] };
  const allowed = new Set(targetIds);
  return { ...course, modules: modules.filter((mod) => allowed.has(mod.id)) };
};

/**
 * A material the server served content for. Absent `locked` means an older response
 * shape, which is treated as open rather than silently hiding a lesson.
 */
const isUnlocked = (mat: ApiCourseMaterial): boolean => mat.locked !== true;

/**
 * Only the modules the viewer may actually study. The server decides this now;
 * previously the trial limit was applied here on the client, which meant it could
 * be skipped by turning JavaScript off.
 */
export const scopeToUnlockedModules = (course: ApiCourseWithTree): ApiCourseWithTree => ({
  ...course,
  modules: (course.modules ?? []).filter((mod) => {
    const materials = mod.materials ?? [];
    return materials.length === 0 || materials.some(isUnlocked);
  }),
});

/** Modules shown in the outline but not openable, so the UI can mark them locked. */
export const findLockedModuleIds = (course: ApiCourseWithTree): Set<string> => {
  const locked = new Set<string>();
  for (const mod of course.modules ?? []) {
    const materials = mod.materials ?? [];
    if (materials.length > 0 && !materials.some(isUnlocked)) locked.add(mod.id);
  }
  return locked;
};

export const hasAnyUnlockedMaterial = (course: ApiCourseWithTree): boolean =>
  (course.modules ?? []).some((mod) => (mod.materials ?? []).some(isUnlocked));

const sortByOrder = <T extends { orderIndex?: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

export const formatMaterialDuration = (mat: ApiCourseMaterial): string => {
  /** Served alongside the lesson; present even when `content` is withheld. */
  if (typeof mat.duration === 'string' && mat.duration.trim()) return mat.duration;
  if (mat.type === 'video' && mat.content && typeof mat.content === 'object') {
    const d = (mat.content as { duration?: string }).duration;
    if (typeof d === 'string' && d.trim()) return d;
  }
  return '-';
};

export const parseDurationLabelToSeconds = (label: string): number | null => {
  const t = label.trim();
  if (!t || t === '-') return null;
  const parts = t.split(':').map((p) => parseInt(p.trim(), 10));
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
};

export const mapApiModulesToCourseStructure = (
  modules: ApiCourseModule[] | undefined,
): CourseModule[] => {
  if (!modules?.length) return [];
  return sortByOrder(modules).map((mod) => ({
    id: mod.id,
    title: mod.title,
    materials: sortByOrder(mod.materials ?? []).map((mat) => ({
      id: mat.id,
      moduleId: mod.id,
      title: mat.title,
      duration: formatMaterialDuration(mat),
      type: mat.type,
    })),
  }));
};

export type FlatMaterialRef = { moduleId: string; material: ApiCourseMaterial };

export const flattenMaterialsInOrder = (course: ApiCourseWithTree): FlatMaterialRef[] => {
  const out: FlatMaterialRef[] = [];
  const modules = sortByOrder(course.modules ?? []);
  for (const mod of modules) {
    for (const mat of sortByOrder(mod.materials ?? [])) {
      out.push({ moduleId: mod.id, material: mat });
    }
  }
  return out;
};

/**
 * Which lesson the course should open at.
 *
 * The address bar decides, so a refresh, the back button and a bookmark all land where
 * the student was. When it names nothing — a first visit — or names a lesson that is
 * not part of this course for this student, whether because the link is stale or the
 * module is not unlocked, the course resumes at the first lesson not yet finished
 * instead. Opening at lesson one every time made a returning student scroll back to
 * where they had got to, and an unusable link is better answered by somewhere sensible
 * than by an error.
 */
export const resolveSelectedMaterialId = (
  /** Only the ids matter here, so anything carrying them will do. */
  flat: ReadonlyArray<{ material: { id: string } }>,
  lessonParam: string | null,
  completedMaterialIds: ReadonlySet<string>,
): string | null => {
  const named = flat.find((row) => row.material.id === lessonParam);
  if (named) return named.material.id;

  const unfinished = flat.find((row) => !completedMaterialIds.has(row.material.id));
  /** Everything done: the last lesson is the one they were most recently on. */
  return (unfinished ?? flat[flat.length - 1])?.material.id ?? null;
};

/**
 * The lesson that follows this one, whatever its type.
 *
 * `findNextVideoMaterialId` skips everything that is not a video, which is right for the
 * "next video" button under a player but wrong as a way through the course: it steps
 * over quizzes and every other kind of material. A quiz needs to lead somewhere too.
 */
export const findNextMaterialId = (
  flat: FlatMaterialRef[],
  currentMaterialId: string | null,
): string | null => {
  if (!flat.length || !currentMaterialId) return null;
  const idx = flat.findIndex((row) => row.material.id === currentMaterialId);
  if (idx < 0) return null;
  return flat[idx + 1]?.material.id ?? null;
};

/**
 * The first lesson of the module after this one.
 *
 * Where a module test leads. Moving on from a test is a bigger step than moving to the
 * next lesson, and the next thing in order may still be inside the module just finished
 * — so the module boundary is what this follows, not position alone.
 */
export const findNextModuleFirstMaterialId = (
  flat: FlatMaterialRef[],
  currentMaterialId: string | null,
): string | null => {
  const idx = flat.findIndex((row) => row.material.id === currentMaterialId);
  if (idx < 0) return null;
  const currentModuleId = flat[idx].moduleId;
  for (let i = idx + 1; i < flat.length; i++) {
    if (flat[i].moduleId !== currentModuleId) return flat[i].material.id;
  }
  return null;
};


export const mapApiAttachments = (
  raw: ApiMaterialAttachment[] | undefined,
): MaterialAttachment[] => {
  if (!raw?.length) return [];
  return [...raw]
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
    .filter((item) => typeof item.id === 'string' && typeof item.url === 'string' && item.url)
    .map((item) => ({
      id: item.id,
      materialId: '',
      kind: item.kind === 'link' ? 'link' : 'file',
      title: item.title?.trim() || item.fileName || item.file_name || 'Attachment',
      url: item.url as string,
      fileName: item.fileName ?? item.file_name ?? null,
      mimeType: item.mimeType ?? item.mime_type ?? null,
      sizeBytes: item.sizeBytes ?? item.size_bytes ?? null,
      orderIndex: item.orderIndex ?? 0,
    }));
};

const youtubeEmbedUrl = (material: ApiCourseMaterial): string => {
  if (material.type !== 'video' || !material.content || typeof material.content !== 'object') {
    return '';
  }
  const id = String((material.content as { youtube_video_id?: string }).youtube_video_id ?? '').trim();
  if (!id) return '';
  return `https://www.youtube.com/embed/${id}`;
};

export const buildLearningLessonFromMaterial = (
  courseTitle: string,
  material: ApiCourseMaterial,
  flatIndex: number,
  totalMaterials: number,
): LearningLesson => {
  const embed = youtubeEmbedUrl(material);
  const typeLabel =
    material.type === 'video'
      ? i18n.t('coursePage.video')
      : material.type.charAt(0).toUpperCase() + material.type.slice(1);

  return {
    materialId: material.id,
    materialType: material.type,
    courseTitle,
    progressText:
      totalMaterials > 0
        ? i18n.t('coursePage.progressText', {
            current: Math.min(flatIndex + 1, totalMaterials),
            total: totalMaterials,
          })
        : i18n.t('coursePage.progressText', { current: 0, total: 0 }),
    streak: '-',
    progress: totalMaterials > 0 ? Math.round(((flatIndex + 1) / totalMaterials) * 100) : 0,
    type: typeLabel,
    status: i18n.t('coursePage.inProgress'),
    title: material.title,
    description: i18n.t('coursePage.defaultDescription'),
    videoUrl: embed || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    attachments: mapApiAttachments(material.attachments),
  };
};
