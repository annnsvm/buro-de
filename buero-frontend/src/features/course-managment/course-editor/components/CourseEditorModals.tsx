import React from 'react';
import CreateCourseModuleModal from '@/features/course-managment/components/CourseManagementWorkspace/CreateCourseModuleModal';
import ConfirmDeleteEntityModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmDeleteEntityModal';
import ConfirmPublishCourseModal from '@/features/course-managment/components/CourseManagementWorkspace/ConfirmPublishCourseModal';
import {
  PUBLISH_COURSE_MODAL_DESCRIPTION,
  UNPUBLISH_COURSE_MODAL_DESCRIPTION,
} from '@/features/course-managment/helpers/courseEntityPublishCopy.helpers';

export type CourseEditorModalsProps = {
  createModuleModalProps: {
    isOpen: boolean;
    mode: 'create' | 'edit';
    initialTitle: string;
    handleOpenChange: (open: boolean) => void;
    onSubmitModule: (args: { title: string }) => Promise<void>;
  };
  deleteModalProps: {
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    isSubmitting: boolean;
    onConfirm: () => void | Promise<void>;
  };
  publishModalProps: {
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    onConfirm: () => void | Promise<void>;
  };
  unpublishModalProps: {
    isOpen: boolean;
    handleOpenChange: (open: boolean) => void;
    isSubmitting: boolean;
    onConfirm: () => void | Promise<void>;
  };
  createModuleModalKey: string;
};

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
      title="Publish course?"
      description={PUBLISH_COURSE_MODAL_DESCRIPTION}
      submittingLabel="Publishing"
    />

    <ConfirmPublishCourseModal
      {...unpublishModalProps}
      title="Unpublish course?"
      description={UNPUBLISH_COURSE_MODAL_DESCRIPTION}
      confirmButtonLabel="Unpublish"
      submittingLabel="Unpublishing"
    />
  </>
);

export default CourseEditorModals;
