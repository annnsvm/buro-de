import React from 'react';
import { BaseDialog } from '@/components/modal';
import LoginModalPanel from './LoginModalPanel';
import ResetPasswordModalPanel from './ResetPasswordModalPanel';
import SignUpModalPanel from './SignUpModalPanel';

export type AuthGlobalDialogProps = {
  variant: 'login' | 'signup' | 'resetPassword';
  isOpen: boolean;
  redirectTo?: string;
  /** Carried from the login box, so the address is not typed a second time. */
  prefillEmail?: string;
  onRequestClose: () => void;
  onExitAnimationComplete: () => void;
};

const AuthGlobalDialog: React.FC<AuthGlobalDialogProps> = ({
  variant,
  isOpen,
  redirectTo,
  prefillEmail,
  onRequestClose,
  onExitAnimationComplete,
}) => {
  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) {
          onRequestClose();
        }
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
    >
      {variant === 'login' ? (
        <LoginModalPanel redirectTo={redirectTo} onDismiss={onRequestClose} />
      ) : variant === 'resetPassword' ? (
        <ResetPasswordModalPanel prefillEmail={prefillEmail} onDismiss={onRequestClose} />
      ) : (
        <SignUpModalPanel redirectTo={redirectTo} onDismiss={onRequestClose} />
      )}
    </BaseDialog>
  );
};

export default AuthGlobalDialog;
