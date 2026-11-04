import React from 'react';
import CreateCourseModuleModal from '@/features/course-managment/components/CourseManagementWorkspace/CreateCourseModuleModal';
import ConfirmDeleteEntityModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmDeleteEntityModal';
import ConfirmPublishCourseModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmPublishCourseModal';
import {
  PUBLISH_COURSE_MODAL_DESCRIPTION,
  UNPUBLISH_COURSE_MODAL_DESCRIPTION,
} from '@/features/course-managment/helpers/courseEntityPublishCopy.helpers';
import type { CourseEditorModalsProps } from '@/types/features/courseManagment/CourseEditorComponents.types';

const CourseEditorModals: React.FC<CourseEditorModalsProps> = ({
  createModuleModalProps,
  deleteModalProps,
  publishModalProps,
  unpublishModalProps,
  createModuleModalKey,
}) => (
  <>
    <CreateCourseModuleModal key={createModuleModalKey} {...createModuleModalProps} />

    <ConfirmDeleteEntityModal {...deleteModalProps} />

    <ConfirmPublishCourseModal
      {...publishModalProps}
      title="Опублікувати курс?"
      description={PUBLISH_COURSE_MODAL_DESCRIPTION}
      submittingLabel="Публікуємо"
    />

    <ConfirmPublishCourseModal
      {...unpublishModalProps}
      title="Зняти курс з публікації?"
      description={UNPUBLISH_COURSE_MODAL_DESCRIPTION}
      confirmButtonLabel="Зняти з публікації"
      submittingLabel="Знімаємо"
    />
  </>
);

export default CourseEditorModals;
