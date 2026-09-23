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

const CourseManagmentPage: React.FC = () => {
  const editor = useCourseEditor();
  const [courseStructureMobileOpen, setCourseStructureMobileOpen] = useState(false);
  /** Which module the CSV import was opened for, if any. */
  const [importTarget, setImportTarget] = useState<{
    moduleId: string;
    moduleTitle: string;
  } | null>(null);

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
