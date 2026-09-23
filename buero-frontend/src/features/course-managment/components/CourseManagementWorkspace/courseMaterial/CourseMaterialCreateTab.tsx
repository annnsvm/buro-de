import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, FormField, Input, Select, Spinner } from '@/components/ui';
import type {
  CreateCourseMaterialModalValues,
  QuizMaterialMode,
} from '@/types/features/courseManagment/CreateCourseMaterialModal.types';
import type {
  CourseMaterialCreateTabProps,
  CourseMaterialType,
} from '@/types/features/courseManagment/CourseMaterialCreateTab.types';
import { extractYouTubeVideoId } from '@/features/course-managment/helpers/extractYouTubeVideoId';
import { MATERIAL_TYPE_OPTIONS } from '@/features/course-managment/helpers/courseMaterials.consts';
import CourseMaterialCreateSection from './CourseMaterialCreateSection';
import CourseMaterialVideoFields from './CourseMaterialVideoFields';
import QuizModeFields from './QuizModeFields';
import CourseMaterialAttachmentsSection from './CourseMaterialAttachmentsSection';
import { getInitialMaterialState } from './helpers/courseMaterialInitialState';

const CourseMaterialCreateTab: React.FC<CourseMaterialCreateTabProps> = ({
  courseId,
  modules,
  activeModuleId,
  activeMaterialId,
  isSubmitting,
  onCreate,
  onUpdate,
  onRequestDeleteMaterial,
}) => {
  const activeModule = useMemo(
    () => modules.find((m) => m.id === activeModuleId) ?? null,
    [modules, activeModuleId],
  );
  const selectedMaterial = useMemo(
    () => activeModule?.materials.find((m) => m.id === activeMaterialId) ?? null,
    [activeModule, activeMaterialId],
  );
  const initialState = getInitialMaterialState(selectedMaterial);

  const [materialType, setMaterialType] = useState<CourseMaterialType>(initialState.materialType);
  const [title, setTitle] = useState(initialState.title);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialState.youtubeVideoId);
  const [youtubeVideoDuration, setYoutubeVideoDuration] = useState(
    initialState.youtubeVideoDuration,
  );
  const [quizMode, setQuizMode] = useState<QuizMaterialMode>(initialState.quizMode);
  const [passingScore, setPassingScore] = useState(initialState.passingScore);
  const [error, setError] = useState<string | null>(null);
  const [createdMaterialId, setCreatedMaterialId] = useState<string | null>(
    initialState.createdMaterialId,
  );
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(initialState.savedSnapshot);
  const [lastCommitKind, setLastCommitKind] = useState<'create' | 'update' | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [hasAttachmentsDraft, setHasAttachmentsDraft] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const flushAttachmentsRef = useRef<(() => Promise<void>) | null>(null);

  const isBusy = isSubmitting || isMutating;

  const buildPayload = (): CreateCourseMaterialModalValues =>
    materialType === 'video'
      ? {
          type: 'video',
          title: title.trim(),
          youtubeVideoId: extractYouTubeVideoId(youtubeVideoId) ?? youtubeVideoId.trim(),
          youtubeVideoDuration: youtubeVideoDuration.trim(),
        }
      : {
          type: 'quiz',
          title: title.trim(),
          quizMode,
          passingScore: quizMode === 'test' ? passingScore : null,
        };

  const currentSnapshot = JSON.stringify(buildPayload());
  const hasFormChanges = Boolean(createdMaterialId) && savedSnapshot !== currentSnapshot;
  const hasUnsavedChanges = hasFormChanges || hasAttachmentsDraft;
  const isInSync = Boolean(createdMaterialId) && !hasUnsavedChanges;

  useEffect(() => {
    if (!hasUnsavedChanges) setNeedsConfirm(false);
  }, [hasUnsavedChanges]);

  const syncedButtonLabel = (() => {
    if (!isInSync) return null;
    if (lastCommitKind === 'create') return 'Created';
    if (lastCommitKind === 'update') return 'Updated';
    if (activeMaterialId) return 'Saved';
    return 'Created';
  })();

  const handleCreateOrUpdate = async () => {
    if (!activeModuleId) {
      setError('Please select module first');
      return;
    }
    if (!title.trim()) return setError('Material title is required');
    if (materialType === 'video' && !youtubeVideoId.trim())
      return setError('YouTube video id is required');
    if (materialType === 'video' && !extractYouTubeVideoId(youtubeVideoId)) {
      return setError('Enter a valid YouTube video id or a supported YouTube link (watch, youtu.be, embed)');
    }
    if (materialType === 'video' && !youtubeVideoDuration.trim())
      return setError('Video duration is required');
    setError(null);
    const payload = buildPayload();

    if (createdMaterialId && !hasUnsavedChanges) {
      return;
    }

    if (createdMaterialId && !needsConfirm) {
      setNeedsConfirm(true);
      return;
    }

    setIsMutating(true);
    try {
      if (createdMaterialId) {
        if (hasFormChanges) {
          await onUpdate(createdMaterialId, payload);
          setSavedSnapshot(JSON.stringify(payload));
        }
        if (flushAttachmentsRef.current) {
          await flushAttachmentsRef.current();
        }
        setLastCommitKind('update');
        setNeedsConfirm(false);
        return;
      }
      const created = await onCreate(payload);
      setCreatedMaterialId(created.id);
      setSavedSnapshot(JSON.stringify(payload));
      setLastCommitKind('create');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save material');
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <CourseMaterialCreateSection>
      <p className="text-sm font-semibold text-[var(--color-text-primary)]">Create material</p>

      <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
        {activeModule ? `Module: ${activeModule.title}` : 'Select a module from sidebar'}
      </p>

      <div className="mt-4 space-y-4">
        <FormField label="Material type" name="materialTypeTab">
          <Select
            ariaLabel="Material type"
            value={materialType}
            options={MATERIAL_TYPE_OPTIONS}
            onChange={(nextValue) => setMaterialType(nextValue as CourseMaterialType)}
            disabled={Boolean(createdMaterialId) || isBusy}
          />
        </FormField>

        <FormField label="Material title" name="materialTitleTab">
          <Input
            id="materialTitleTab"
            placeholder="e.g. Lesson 1: Greetings"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isBusy}
          />
        </FormField>

        {materialType === 'video' ? (
          <CourseMaterialVideoFields
            youtubeVideoId={youtubeVideoId}
            youtubeVideoDuration={youtubeVideoDuration}
            isSubmitting={isBusy}
            onYoutubeVideoIdChange={setYoutubeVideoId}
            onYoutubeVideoDurationChange={setYoutubeVideoDuration}
          />
        ) : (
          <QuizModeFields
            quizMode={quizMode}
            passingScore={passingScore}
            isSubmitting={isBusy}
            onQuizModeChange={setQuizMode}
            onPassingScoreChange={setPassingScore}
          />
        )}
      </div>

      {createdMaterialId && courseId && activeModuleId ? (
        <CourseMaterialAttachmentsSection
          courseId={courseId}
          moduleId={activeModuleId}
          materialId={createdMaterialId}
          onDraftChange={setHasAttachmentsDraft}
          flushRef={flushAttachmentsRef}
        />
      ) : (
        <p className="mt-6 text-xs text-[var(--color-text-secondary)]">
          Save the lesson first to add attachments.
        </p>
      )}

      {error ? <p className="mt-2 text-sm text-[var(--color-error)]">{error}</p> : null}

      {activeMaterialId && onRequestDeleteMaterial ? (
        <div className="mt-6 flex justify-center border-t border-[var(--color-border-subtle)] pt-6">
          <Button
            type="button"
            variant="outlineDark"
            onClick={onRequestDeleteMaterial}
            disabled={isBusy}
            className="!border-[var(--color-error)] !text-[var(--color-error)] hover:!border-[var(--color-error)]"
          >
            Delete material
          </Button>
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-center">
        <Button
          type="button"
          variant="solid"
          onClick={handleCreateOrUpdate}
          disabled={isBusy || isInSync}
        >
          {isBusy ? (
            <span className="inline-flex items-center gap-2">
              <Spinner variant="onPrimary" className="size-5" />
              {createdMaterialId && hasUnsavedChanges ? 'Updating' : 'Creating'}
            </span>
          ) : isInSync ? (
            syncedButtonLabel
          ) : createdMaterialId && needsConfirm ? (
            'Confirm'
          ) : hasUnsavedChanges ? (
            'Save changes'
          ) : (
            'Create material'
          )}
        </Button>
      </div>
    </CourseMaterialCreateSection>
  );
};

export default CourseMaterialCreateTab;
