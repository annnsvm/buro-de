import React from 'react';
import { Container, Section } from '@/components/layout';
import CourseMaterialCreateTab from '@/features/course-managment/components/CourseManagementWorkspace/courseMaterial';
import QuestionEditor from '@/features/course-managment/components/QuestionEditor/QuestionEditor';
import type { CourseEditorMaterialPanelProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorMaterialPanel: React.FC<CourseEditorMaterialPanelProps> = ({
  courseId,
  modules,
  activeModuleIdForMaterial,
  activeMaterialIdForEdit,
  isCreatingMaterial,
  onRequestDeleteMaterial,
  onCreate,
  onUpdate,
}) => {
  /**
   * Questions live in their own table, so a saved quiz is edited question by question
   * rather than through the material form. The form above still handles the title and
   * the settings the material itself carries.
   */
  const editedMaterial = modules
    .flatMap((mod) => mod.materials.map((material) => ({ material, moduleId: mod.id })))
    .find((entry) => entry.material.id === activeMaterialIdForEdit);
  const showQuestionEditor =
    Boolean(courseId) &&
    Boolean(activeMaterialIdForEdit) &&
    editedMaterial?.material.type === 'quiz';

  return (
    <Section className="py-8">
      <Container className="max-w-[1100px] px-4 sm:px-6">
        <CourseMaterialCreateTab
          key={`${activeModuleIdForMaterial ?? 'module-none'}:${activeMaterialIdForEdit ?? 'material-new'}`}
          courseId={courseId}
          modules={modules}
          activeModuleId={activeModuleIdForMaterial}
          activeMaterialId={activeMaterialIdForEdit}
          isSubmitting={isCreatingMaterial}
          onRequestDeleteMaterial={onRequestDeleteMaterial}
          onCreate={onCreate}
          onUpdate={onUpdate}
        />

        {showQuestionEditor && courseId && editedMaterial && activeMaterialIdForEdit ? (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
              {editedMaterial.material.quizMode === 'test'
                ? 'Завдання тесту'
                : 'Питання квізу'}
            </h3>
            <div className="mt-4">
              <QuestionEditor
                courseId={courseId}
                moduleId={editedMaterial.moduleId}
                materialId={activeMaterialIdForEdit}
                /**
                 * A lesson quiz is scored on questions, so a weight typed there would
                 * change nothing. Saying so is better than offering a field that
                 * silently does not apply.
                 */
                scoredByPoints={editedMaterial.material.quizMode === 'test'}
              />
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
};

export default CourseEditorMaterialPanel;
