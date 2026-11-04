import React from 'react';
import { Container, Section } from '@/components/layout';
import CourseMaterialCreateTab from '@/features/course-managment/components/CourseManagementWorkspace/courseMaterial';
import QuestionEditor from '@/features/course-managment/components/QuestionEditor/QuestionEditor';
import type { PracticeBlockName } from '@/api/questionEditorApi';
import type { CourseEditorMaterialPanelProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

/** Every block a practice can hold, in the order the course teaches them. */
const PRACTICE_BLOCKS: readonly PracticeBlockName[] = [
  'grammatik',
  'lesen',
  'horen',
  'sprechen',
  'schreiben',
];

/** A module test has no letter and no spoken answer: three skills, marked on the spot. */
const TEST_BLOCKS: readonly PracticeBlockName[] = ['grammatik', 'lesen', 'horen'];

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
    /** A practice holds questions the same way a quiz does, so both are edited here. */
    ['quiz', 'practice'].includes(editedMaterial?.material.type ?? '');

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
              {editedMaterial.material.type === 'practice'
                ? 'Питання практики'
                : editedMaterial.material.quizMode === 'test'
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
                /**
                 * Which parts this material has, which is not the same question as what
                 * kind it is. A practice has all five; a module test has three - no letter
                 * and no spoken answer in it, by the author's decision. Anything else is
                 * one plain list.
                 */
                blocks={
                  editedMaterial.material.type === 'practice'
                    ? PRACTICE_BLOCKS
                    : editedMaterial.material.quizMode === 'test'
                      ? TEST_BLOCKS
                      : []
                }
              />
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
};

export default CourseEditorMaterialPanel;
