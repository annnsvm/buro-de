import React, { useState } from 'react';

import CourseStructureAside from '@/features/course-managment/components/CourseManagementWorkspace/courseStructureAside';
import { useCourseEditor } from '@/features/course-managment/course-editor/hooks/useCourseEditor';
import CourseEditorLoadingScreen from '@/features/course-managment/course-editor/components/CourseEditorLoadingScreen';
import CourseEditorShell from '@/features/course-managment/course-editor/components/CourseEditorShell';
import CourseEditorHeader from '@/features/course-managment/course-editor/components/CourseEditorHeader';
import CourseEditorCourseFormTab from '@/features/course-managment/course-editor/components/CourseEditorCourseFormTab';
import CourseEditorMaterialPanel from '@/features/course-managment/course-editor/components/CourseEditorMaterialPanel';
import CourseEditorModals from '@/features/course-managment/course-editor/components/CourseEditorModals';
import ImportQuestionsModal from '@/features/course-managment/components/ImportQuestionsModal/ImportQuestionsModal';
import { publishMaterial, publishModule } from '@/api/questionEditorApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';

const CourseManagmentPage: React.FC = () => {
  const editor = useCourseEditor();
  const [courseStructureMobileOpen, setCourseStructureMobileOpen] = useState(false);
  /** Which module the CSV import was opened for, if any. */
  const [importTarget, setImportTarget] = useState<{
    moduleId: string;
    moduleTitle: string;
  } | null>(null);
  /** The module being published, so only its own button says it is working. */
  const [publishingModuleId, setPublishingModuleId] = useState<string | null>(null);
  /** The material being published, so only its own row shows it is working. */
  const [publishingMaterialId, setPublishingMaterialId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  /**
   * Letting a module out: everything that arrived with the import, released together.
   *
   * The tree is reloaded afterwards rather than patched, because publishing changes the
   * dates of the materials, their questions and their texts at once, and the sidebar is
   * drawn from that tree. A guess at the new state is one more thing that can disagree
   * with the server.
   */
  const handlePublishModule = async (moduleId: string) => {
    const courseId = editor.asideProps.courseId;
    if (!courseId || publishingModuleId) return;
    setPublishingModuleId(moduleId);
    setPublishError(null);
    try {
      await publishModule(courseId, moduleId);
      editor.refreshStructure();
    } catch (err: unknown) {
      setPublishError(getErrorMessage(err, 'Не вдалося опублікувати модуль'));
    } finally {
      setPublishingModuleId(null);
    }
  };

  /**
   * Letting out one material, with every block inside it.
   *
   * The unit between a single block and the whole module, and the one a module is actually
   * written in: two practices finished and a third still half a transcript. Publishing
   * without naming a block publishes all of them, which is what "this practice is ready"
   * means.
   */
  const handlePublishMaterial = async (moduleId: string, materialId: string) => {
    const courseId = editor.asideProps.courseId;
    if (!courseId || publishingMaterialId || publishingModuleId) return;
    setPublishingMaterialId(materialId);
    setPublishError(null);
    try {
      await publishMaterial(courseId, moduleId, materialId);
      editor.refreshStructure();
    } catch (err: unknown) {
      setPublishError(getErrorMessage(err, 'Не вдалося опублікувати матеріал'));
    } finally {
      setPublishingMaterialId(null);
    }
  };

  if (editor.showBootstrapLoading) {
    return <CourseEditorLoadingScreen />;
  }

  return (
    <div>
      <CourseEditorShell
        onRequestOpenCourseStructureMobile={() => setCourseStructureMobileOpen(true)}
        aside={
          <CourseStructureAside
            {...editor.asideProps}
            onImportQuestions={(moduleId, moduleTitle) =>
              setImportTarget({ moduleId, moduleTitle })
            }
            onPublishModule={(moduleId) => void handlePublishModule(moduleId)}
            publishingModuleId={publishingModuleId}
            onPublishMaterial={(moduleId, materialId) =>
              void handlePublishMaterial(moduleId, materialId)
            }
            publishingMaterialId={publishingMaterialId}
            courseStructureMobileOpen={courseStructureMobileOpen}
            onCourseStructureMobileChange={setCourseStructureMobileOpen}
            hideMobileFloatingStructureButton
          />
        }
      >
        <CourseEditorHeader {...editor.headerProps} />
        {editor.activeRightTab === 'course' ? (
          <CourseEditorCourseFormTab {...editor.courseFormProps} />
        ) : (
          <CourseEditorMaterialPanel {...editor.materialPanelProps} />
        )}
      </CourseEditorShell>

      {publishError ? (
        <p
          role="alert"
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[var(--color-error)] px-5 py-2 text-sm text-white"
        >
          {publishError}
        </p>
      ) : null}

      <CourseEditorModals
        createModuleModalProps={editor.createModuleModalProps}
        deleteModalProps={editor.deleteModalProps}
        publishModalProps={editor.publishModalProps}
        unpublishModalProps={editor.unpublishModalProps}
        createModuleModalKey={editor.createModuleModalKey}
      />

      {importTarget && editor.asideProps.courseId ? (
        <ImportQuestionsModal
          isOpen
          handleOpenChange={(open) => {
            if (!open) setImportTarget(null);
          }}
          courseId={editor.asideProps.courseId}
          moduleId={importTarget.moduleId}
          moduleTitle={importTarget.moduleTitle}
          onImported={() => {
            // Reload the tree so the new quizzes appear in the structure at once.
            editor.refreshStructure();
          }}
        />
      ) : null}
    </div>
  );
};

export default CourseManagmentPage;
