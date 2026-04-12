import React from 'react';
import { ModalRootProps } from '@/types/components/modal/ModalRoot.types';
import { LoginModal, SignUpModal, LogoutConfirmModal, ProfileModal } from '@/features/auth';
import { CourseInfoModal, ContactSupportModal } from '@/features/courses-catalog';
import AddVocabularyModal from '@/features/course-learning/AddVocabularyModal/AddVocabularyModal';
import { closeGlobalModal } from '@/redux/slices/ui/uiSlice';
import { useDispatch } from 'react-redux';
import useModal from './context/useModal';
import type { UiModalPayload } from '@/types/components/modal/UIModalType.types';

const ModalRoot: React.FC<ModalRootProps> = ({ globalModal, uiModalStack }) => {
  const dispatch = useDispatch();
  const { popUiModal } = useModal();
   
  const renderGlobalModal = () => {
    const m = globalModal;
    switch (m.type) {
      case null:
        return null;
      case 'login':
        return (
          <LoginModal
            isOpen
            handleOpenChange={(isOpen) => {
              if (!isOpen) {
                dispatch(closeGlobalModal());
              }
            }}
            redirectTo={m.redirectTo}
          />
        );
      case 'signup':
        return (
          <SignUpModal
            isOpen
            handleOpenChange={(open) => {
              if (!open) dispatch(closeGlobalModal());
            }}
            redirectTo={m.redirectTo}
          />
        );
      case 'profile':
        return (
          <ProfileModal
            isOpen
            handleOpenChange={(open) => {
              if (!open) dispatch(closeGlobalModal());
            }}
          />
        );
      case 'logoutConfirm':
        return (
          <LogoutConfirmModal
            isOpen
            handleOpenChange={(open: unknown) => {
              if (!open) dispatch(closeGlobalModal());
            }}
          />
        );
      case 'resetPassword':
      case 'paymentCard':
        return null;
      default: {
        const _exhaustive: never = m;
        return _exhaustive;
      }
    }
  };

  const renderUiModalByType = (item: UiModalPayload, index: number) => {
    const modalKey = `${item.type}-${index}`;
    const commonProps = {
      isOpen: true,
      handleOpenChange: (open: boolean) => {
        if (!open) {
          popUiModal();
        }
      },
    };

    switch (item.type) {
      case 'courseInfo':
        return (
          <CourseInfoModal
            key={modalKey}
            {...commonProps}
            courseId={item.courseId}
            course={item.course}
          />
        );

      case 'contactSupport':
        return (
          <ContactSupportModal
            key={modalKey}
            {...commonProps}
            subject={item.subject}
            courseId={item.courseId}
            prefillEmail={item.prefillEmail}
          />
        );

      case 'addVocabulary':
        return (
          <AddVocabularyModal
            key={modalKey}
            {...commonProps}
          />
        );

      case 'addVocabularySuccess':
      case 'confirm':
      default:
        return null;
    }
  };

  const renderUiModals = () => {
    if (!uiModalStack.length) return null;

    return uiModalStack.map((item, index) => {
      const isTop = index === uiModalStack.length - 1;

      if (!isTop) return null;

      return renderUiModalByType(item, index);
    });
  };

  return (
    <>
      {renderGlobalModal()}
      {renderUiModals()}
    </>
  );
};

export default ModalRoot;
