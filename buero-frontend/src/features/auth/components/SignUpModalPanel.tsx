import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalBody from '@/components/modal/ui/ModalBody';
import ModalHeader from '@/components/modal/ui/ModalHeader';
import ModalFooter from '@/components/modal/ui/ModalFooter';
import { Button, FormField, Input, PasswordInput, Spinner } from '@/components/ui';
import { useAppDispatch } from '@/redux/hooks';
import { signUpSchema } from '@/features/auth/validation/signUpSchema';
import { SignUpFormValues } from '@/types/features/auth/validation.types';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { Text } from '@/components/layout';
import {
  resendSignupCodeThunk,
  startSignupThunk,
  verifySignupThunk,
} from '@/redux/slices/auth/authThunks';
import { ROUTES } from '@/helpers/routes';
import {
  authErrorText,
  authFailure,
  translateFieldError,
} from '@/helpers/authErrorMessage';
import type { AuthFailure } from '@/helpers/authErrorMessage';
import { LOADING_STATUS } from '@/helpers/lodaingStatus';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from '@/redux/slices/auth';
import { createCheckoutSessionThunk } from '@/redux/slices/subscriptions/subscriptionsThunks';
import { consumePendingCourseTrial } from '@/features/courses-catalog/courseTrialFlow';
import {
  PAYMENT_RETURN_KEY,
  PENDING_CHECKOUT_KEY,
  savePendingOrderReference,
} from '@/helpers/sessionPendingAuth';

type PendingCheckoutPayload = {
  courseId: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type SignUpModalPanelProps = {
  redirectTo?: string;
  /** Carried over from a screen that already asked for it - see `ModalRoot`. */
  prefillEmail?: string;
  onDismiss: () => void;
};

const SignUpModalPanel: React.FC<SignUpModalPanelProps> = ({
  redirectTo,
  prefillEmail,
  onDismiss,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loadingStatus = useSelector(selectAuthStatus);
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  /**
   * Which failure it was, not just what it said.
   *
   * One of them has an answer better than words: an address that already has an account
   * does not need registering, it needs signing in. Someone who clicked "try the course"
   * and typed the address they have used here before is not making a mistake - they simply
   * landed on the wrong one of two forms, and the form can hand them to the right one
   * rather than explain.
   */
  const [failure, setFailure] = useState<AuthFailure | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: prefillEmail ?? '',
      password: '',
    },
  });

  const finishAuthenticated = async () => {
    const pendingCheckoutRaw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
    if (pendingCheckoutRaw) {
      sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
      try {
        const pendingCheckout = JSON.parse(pendingCheckoutRaw) as PendingCheckoutPayload;
        if (pendingCheckout.courseId) {
          const checkoutAction = await dispatch(
            createCheckoutSessionThunk({
              courseId: pendingCheckout.courseId,
              successUrl: pendingCheckout.successUrl,
              cancelUrl: pendingCheckout.cancelUrl,
            }),
          );
          if (createCheckoutSessionThunk.fulfilled.match(checkoutAction)) {
            const checkoutUrl = checkoutAction.payload.url;
            if (checkoutUrl) {
              sessionStorage.setItem(PAYMENT_RETURN_KEY, 'pending');
              savePendingOrderReference(checkoutAction.payload.order_reference);
              onDismiss();
              window.location.href = checkoutUrl;
              return;
            }
          }
          if (createCheckoutSessionThunk.rejected.match(checkoutAction)) {
            const checkoutError =
              typeof checkoutAction.payload === 'string'
                ? checkoutAction.payload
                : checkoutAction.error?.message ?? '';
            const normalizedCheckoutError = checkoutError.toLowerCase();
            const alreadyHasAccess =
              normalizedCheckoutError.includes('already own') ||
              normalizedCheckoutError.includes('already have access') ||
              normalizedCheckoutError.includes('already have trial access');
            if (alreadyHasAccess) {
              onDismiss();
              navigate(ROUTES.COURSES);
              return;
            }
          }
        }
      } catch {
        void 0;
      }
    }

    const didTrial = await consumePendingCourseTrial(navigate, dispatch);
    if (didTrial) {
      onDismiss();
      return;
    }

    onDismiss();
    navigate(redirectTo ?? ROUTES.COURSES);
  };

  const onSubmit = handleSubmit(async (values) => {
    setFailure(null);
    try {
      const locale = i18n.language.toLowerCase().startsWith('uk') ? 'uk' : 'en';
      await dispatch(
        startSignupThunk({
          name: values.name.trim(),
          email: values.email,
          password: values.password,
          locale,
          redirectTo,
        }),
      ).unwrap();

      setPendingEmail(values.email);
      setVerifyCode('');
      setVerifyError(null);
      setResent(false);
      setStep('verify');
    } catch (error) {
      setFailure(authFailure(error));
      setError('root', {
        type: 'server',
        message: authErrorText(error, t, 'auth.signUpFailed'),
      });
    }
  });

  const onVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    const code = verifyCode.replace(/\D/g, '');
    /** Caught here rather than sent, so six digits is what the server is ever asked about. */
    if (code.length !== 6) {
      setVerifyError(t('auth.errors.CODE_WRONG'));
      return;
    }

    try {
      setVerifyError(null);
      await dispatch(verifySignupThunk({ email: pendingEmail, code })).unwrap();
      await finishAuthenticated();
    } catch (error) {
      setVerifyError(authErrorText(error, t, 'auth.verifyFailed'));
    }
  };

  const onResend = async () => {
    try {
      setVerifyError(null);
      await dispatch(resendSignupCodeThunk({ email: pendingEmail })).unwrap();
      setResent(true);
    } catch (error) {
      setVerifyError(authErrorText(error, t, 'auth.verifyFailed'));
    }
  };

  if (step === 'verify') {
    return (
      <ModalBody>
        <ModalHeader
          title={t('auth.verifyTitle')}
          description={t('auth.verifyDescription', { email: pendingEmail })}
          className="mb-8"
        />

        <form onSubmit={onVerify} className="relative flex flex-col gap-4">
          <FormField name="verify-code" error={verifyError ?? undefined}>
            <Input
              id="signup-verify-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder={t('auth.verifyCode')}
              value={verifyCode}
              onChange={(event) => {
                setVerifyCode(event.target.value.replace(/\D/g, '').slice(0, 6));
                setResent(false);
              }}
              className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-center text-[1.35rem] tracking-[0.35em] text-[var(--color-text-primary)] placeholder:tracking-normal placeholder:text-[var(--opacity-neutral-darkest-60)]"
            />
          </FormField>

          <Button type="submit" disabled={loadingStatus === LOADING_STATUS.LOADING} className="mt-2 w-full" variant="solid">
            {loadingStatus === LOADING_STATUS.LOADING ? <Spinner /> : t('auth.verifyButton')}
          </Button>
        </form>

        <ModalFooter>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              className="hover:text-[var(--color-primary)]"
              onClick={() => void onResend()}
            >
              <Text label="Resend verification code" className="text-[1.125rem]">
                {resent ? t('auth.verifyResent') : t('auth.verifyResend')}
              </Text>
            </button>
            <button
              type="button"
              className="hover:text-[var(--color-primary)]"
              onClick={() => {
                setStep('form');
                setVerifyError(null);
              }}
            >
              <Text label="Change email" className="text-[1.125rem]">
                {t('auth.verifyBack')}
              </Text>
            </button>
          </div>
        </ModalFooter>
      </ModalBody>
    );
  }

  return (
    <ModalBody>
      <ModalHeader title={t('auth.signUpTitle')} description={t('auth.signUpDescription')} className="mb-8" />

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField name="name" error={translateFieldError(errors.name?.message, t)}>
          <Input
            id="signup-name"
            type="text"
            placeholder={t('auth.name')}
            autoComplete="name"
            className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
            {...register('name')}
          />
        </FormField>

        <FormField name="email" error={translateFieldError(errors.email?.message, t)}>
          <Input
            id="signup-email"
            type="email"
            placeholder={t('auth.email')}
            autoComplete="email"
            className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
            {...register('email')}
          />
        </FormField>

        <FormField name="password" error={translateFieldError(errors.password?.message, t)}>
          <PasswordInput
            id="signup-password"
            placeholder={t('auth.password')}
            autoComplete="new-password"
            className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
            {...register('password')}
          />
        </FormField>

        {/**
         * In the flow, like every other message on this form.
         *
         * It used to be pinned with `absolute bottom-16`, which meant it grew upwards from
         * a fixed point - fine for the one short line it was written for, and not fine for
         * anything longer. On a phone, where the box is narrow, "Ця пошта вже
         * зареєстрована. Увійдіть або скиньте пароль." takes two or three lines and the
         * extra ones climbed over the password field.
         */}
        {errors.root && (
          <p className="text-sm text-[var(--color-error)]" role="alert">
            {errors.root.message}
          </p>
        )}

        {/**
         * The mirror of what the login form already offers when an address has no account.
         * The address goes with them, because they have typed it once already.
         */}
        {failure === 'EMAIL_TAKEN' ? (
          <button
            type="button"
            className="self-start text-sm font-medium text-[var(--color-primary)] underline"
            onClick={() => {
              dispatch(
                openGlobalModal({
                  type: 'login',
                  redirectTo,
                  prefillEmail: getValues('email'),
                }),
              );
            }}
          >
            {t('auth.goToLogin')}
          </button>
        ) : null}

        <Button type="submit" disabled={isSubmitting} className="mt-2 w-full" variant="solid">
          {loadingStatus === LOADING_STATUS.LOADING ? <Spinner /> : t('auth.signUpButton')}
        </Button>
      </form>
      <ModalFooter>
        <button
          type="button"
          className="hover:text-[var(--color-primary)]"
          onClick={() => {
            dispatch(
              openGlobalModal({
                type: 'login',
                redirectTo,
              }),
            );
          }}
        >
          <Text className="text-[1.125rem]">
            {t('auth.switchToLogin')}
          </Text>
        </button>
      </ModalFooter>
    </ModalBody>
  );
};

export default SignUpModalPanel;
