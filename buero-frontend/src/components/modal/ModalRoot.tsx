import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ModalRootProps } from '@/types/components/modal/ModalRoot.types';
import { AuthGlobalDialog, LogoutConfirmModal, ProfileModal } from '@/features/auth';
import { CourseInfoModal, ContactSupportModal } from '@/features/courses-catalog';
import AddVocabularyModal from '@/features/course-learning/AddVocabularyModal/AddVocabularyModal';
import { closeGlobalModal } from '@/redux/slices/ui/uiSlice';
import { useDispatch } from 'react-redux';
import useModal from './context/useModal';
import type { UiModalPayload } from '@/types/components/modal/UIModalType.types';
import type { GlobalModalType } from '@/types/components/modal/GlobalModalType.types';
import { clearAllPendingAuthCourseSession } from '@/helpers/sessionPendingAuth';

const ModalRoot: React.FC<ModalRootProps> = ({ globalModal, uiModalStack }) => {
  const dispatch = useDispatch();
  const { popUiModal } = useModal();

  const [authExitHold, setAuthExitHold] = useState(false);
  const [profileExitHold, setProfileExitHold] = useState(false);
  const [logoutExitHold, setLogoutExitHold] = useState(false);
  const [uiModalClosing, setUiModalClosing] = useState(false);

  const prevGlobalModalTypeRef = useRef<GlobalModalType | undefined>(undefined);
  const authVariantRef = useRef<'login' | 'signup' | 'resetPassword'>('login');
  const authEmailRef = useRef<string | undefined>(undefined);
  const authRedirectRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (uiModalStack.length === 0) {
      setUiModalClosing(false);
    }
  }, [uiModalStack.length]);

  useEffect(() => {
    const curr = globalModal.type;
    const prev = prevGlobalModalTypeRef.current;

    /**
     * The reset panel is a third face of the auth dialog rather than a dialog of its own:
     * moving between "log in" and "I forgot it" must not look like one box closing and
     * another opening on top of it.
     */
    if (curr === 'login' || curr === 'signup' || curr === 'resetPassword') {
      setAuthExitHold(true);
      authVariantRef.current = curr;
      if (globalModal.type === 'login' || globalModal.type === 'signup') {
        authRedirectRef.current = globalModal.redirectTo;
      }
      if (globalModal.type === 'resetPassword') {
        authEmailRef.current = globalModal.prefillEmail;
      }
    } else if (
      /**
       * Moved from an auth panel to some other modal. The branch above has already
       * excluded every auth type from `curr`, so re-testing them here only told the
       * compiler what it knew - and a condition that cannot be false reads as a
       * condition that was meant to do something.
       */
      (prev === 'login' || prev === 'signup' || prev === 'resetPassword') &&
      curr !== null
    ) {
      setAuthExitHold(false);
    }

    if (curr === 'profile') {
      setProfileExitHold(true);
    } else if (prev === 'profile' && curr !== null) {
      setProfileExitHold(false);
    }

    if (curr === 'logoutConfirm') {
      setLogoutExitHold(true);
    } else if (prev === 'logoutConfirm' && curr !== null) {
      setLogoutExitHold(false);
    }

    prevGlobalModalTypeRef.current = curr;
  }, [globalModal]);

  const handleUiModalRequestClose = useCallback(() => {
    setUiModalClosing(true);
  }, []);

  const completeUiModalClose = useCallback(() => {
    popUiModal();
    setUiModalClosing(false);
  }, [popUiModal]);

  const topUiIndex = uiModalStack.length - 1;
  const isTopUiOpen = topUiIndex >= 0 && !uiModalClosing;

  const shouldMountAuth =
    globalModal.type === 'login' ||
    globalModal.type === 'signup' ||
    globalModal.type === 'resetPassword' ||
    authExitHold;

  const renderAuthModal = () => {
    if (!shouldMountAuth) {
      return null;
    }

    const variant: 'login' | 'signup' | 'resetPassword' =
      globalModal.type === 'login'
        ? 'login'
        : globalModal.type === 'signup'
          ? 'signup'
          : globalModal.type === 'resetPassword'
            ? 'resetPassword'
            : authVariantRef.current;

    const redirectTo =
      globalModal.type === 'login' || globalModal.type === 'signup'
        ? globalModal.redirectTo
        : authRedirectRef.current;

    return (
      <AuthGlobalDialog
        variant={variant}
        isOpen={
          globalModal.type === 'login' ||
          globalModal.type === 'signup' ||
          globalModal.type === 'resetPassword'
        }
        redirectTo={redirectTo}
        prefillEmail={
          globalModal.type === 'resetPassword'
            ? globalModal.prefillEmail
            : authEmailRef.current
        }
        onRequestClose={() => {
          clearAllPendingAuthCourseSession();
          dispatch(closeGlobalModal());
        }}
        onExitAnimationComplete={() => setAuthExitHold(false)}
      />
    );
  };

  const shouldMountProfile = globalModal.type === 'profile' || profileExitHold;

  const renderProfileModal = () => {
    if (!shouldMountProfile) {
      return null;
    }

    return (
      <ProfileModal
        isOpen={globalModal.type === 'profile'}
        handleOpenChange={(open) => {
          if (!open) {
            dispatch(closeGlobalModal());
          }
        }}
        onExitAnimationComplete={() => setProfileExitHold(false)}
      />
    );
  };

  const shouldMountLogout = globalModal.type === 'logoutConfirm' || logoutExitHold;

  const renderLogoutConfirmModal = () => {
    if (!shouldMountLogout) {
      return null;
    }

    return (
      <LogoutConfirmModal
        isOpen={globalModal.type === 'logoutConfirm'}
        handleOpenChange={(open) => {
          if (!open) {
            dispatch(closeGlobalModal());
          }
        }}
        onExitAnimationComplete={() => setLogoutExitHold(false)}
      />
    );
  };

  const renderGlobalModal = () => {
    const m = globalModal;
    switch (m.type) {
      case null:
        return null;
      case 'login':
      case 'signup':
      case 'profile':
      case 'logoutConfirm':
        return null;
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
    const isTop = index === topUiIndex;

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        handleUiModalRequestClose();
      }
    };

    switch (item.type) {
      case 'courseInfo':
        return (
          <CourseInfoModal
            key={modalKey}
            isOpen={isTop && isTopUiOpen}
            handleOpenChange={handleOpenChange}
            onExitAnimationComplete={completeUiModalClose}
            courseId={item.courseId}
            course={item.course}
          />
        );

      case 'contactSupport':
        return (
          <ContactSupportModal
            key={modalKey}
            isOpen={isTop && isTopUiOpen}
            handleOpenChange={handleOpenChange}
            onExitAnimationComplete={completeUiModalClose}
            subject={item.subject}
            courseId={item.courseId}
            prefillEmail={item.prefillEmail}
          />
        );

      case 'addVocabulary':
        return (
          <AddVocabularyModal
            key={modalKey}
            isOpen={isTop && isTopUiOpen}
            handleOpenChange={handleOpenChange}
            onExitAnimationComplete={completeUiModalClose}
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
      {renderUiModals()}
      {renderGlobalModal()}
      {renderProfileModal()}
      {renderLogoutConfirmModal()}
      {renderAuthModal()}
    </>
  );
};

export default ModalRoot;
