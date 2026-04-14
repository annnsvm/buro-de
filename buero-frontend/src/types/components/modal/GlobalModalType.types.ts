type GlobalModalType =
  | 'login'
  | 'signup'
  | 'resetPassword'
  | 'paymentCard'
  | 'profile'
  | 'logoutConfirm'
  | null;

type GlobalModalState =
  | { type: null }
  | { type: 'login'; redirectTo?: string }
  | { type: 'signup'; redirectTo?: string; prefillEmail?: string }
  | { type: 'resetPassword'; prefillEmail?: string }
  | { type: 'paymentCard'; courseId: string; price: number; currency: string }
  | { type: 'profile' }
  | { type: 'logoutConfirm' };

export type { GlobalModalType, GlobalModalState };
