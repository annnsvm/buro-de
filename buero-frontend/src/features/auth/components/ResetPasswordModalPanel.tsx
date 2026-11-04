import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { Button, FormField, Input, PasswordInput, Spinner } from '@/components/ui';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/modal';
import { Text } from '@/components/layout';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { requestPasswordReset, resetPassword } from '@/api/passwordResetApi';

export type ResetPasswordModalPanelProps = {
  prefillEmail?: string;
  onDismiss: () => void;
};

/**
 * Getting back in after forgetting the password.
 *
 * Two steps rather than one screen with everything on it: the address, then the code and
 * the new password together. The student has to leave for their inbox between the two, and
 * a form that asked for all three at once would be a form they had to come back to with
 * half of it already stale.
 *
 * The first step cannot say "we sent a code to you" - the server answers the same way
 * whether or not the address has an account, on purpose, so that this is not a way of
 * finding out who has bought the course. So the screen says what is actually true: if
 * there is an account, the code is on its way.
 */
const ResetPasswordModalPanel: React.FC<ResetPasswordModalPanelProps> = ({
  prefillEmail,
  onDismiss,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(prefillEmail ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const locale = i18n.language === 'uk' ? 'uk' : 'en';

  const askForCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !email.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset(email.trim(), locale);
      setStep('code');
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('auth.resetRequestFailed')));
    } finally {
      setBusy(false);
    }
  };

  const setNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !code.trim() || !password) return;
    setBusy(true);
    setError(null);
    try {
      await resetPassword(email.trim(), code.trim(), password);
      setDone(true);
    } catch (err: unknown) {
      setError(getErrorMessage(err, t('auth.resetFailed')));
    } finally {
      setBusy(false);
    }
  };

  const FIELD =
    'rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]';

  /**
   * Done, and the way on is the login - the server has signed every session out, including
   * any the student still had open, so there is nothing to return to but the front door.
   */
  if (done) {
    return (
      <ModalBody>
        <ModalHeader
          title={t('auth.resetDoneTitle')}
          description={t('auth.resetDoneDescription')}
          className="mb-8"
        />
        <Button
          type="button"
          variant="solid"
          className="w-full"
          onClick={() => dispatch(openGlobalModal({ type: 'login' }))}
        >
          {t('auth.loginButton')}
        </Button>
      </ModalBody>
    );
  }

  return (
    <ModalBody>
      <ModalHeader
        title={t('auth.resetTitle')}
        description={
          step === 'email' ? t('auth.resetDescription') : t('auth.resetCodeSent')
        }
        className="mb-8"
      />

      {step === 'email' ? (
        <form onSubmit={askForCode} className="flex flex-col gap-4">
          <FormField name="reset-email">
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('auth.email')}
              autoComplete="email"
              autoFocus
              className={FIELD}
            />
          </FormField>

          {error ? <p className="text-[var(--color-error)]">{error}</p> : null}

          <Button
            type="submit"
            variant="solid"
            disabled={busy || !email.trim()}
            className="mt-2 w-full"
          >
            {busy ? <Spinner /> : t('auth.resetSendCode')}
          </Button>
        </form>
      ) : (
        <form onSubmit={setNewPassword} className="flex flex-col gap-4">
          <FormField name="reset-code">
            <Input
              id="reset-code"
              inputMode="numeric"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={t('auth.resetCodePlaceholder')}
              autoComplete="one-time-code"
              autoFocus
              className={FIELD}
            />
          </FormField>

          <FormField name="reset-password" error={undefined}>
            <PasswordInput
              id="reset-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('auth.resetNewPassword')}
              autoComplete="new-password"
              className={FIELD}
            />
          </FormField>

          {/** The server's rule, said before it is enforced rather than after. */}
          <Text className="text-sm text-[var(--color-text-secondary)]">
            {t('auth.resetPasswordRule')}
          </Text>

          {error ? <p className="text-[var(--color-error)]">{error}</p> : null}

          <Button
            type="submit"
            variant="solid"
            disabled={busy || !code.trim() || !password}
            className="mt-2 w-full"
          >
            {busy ? <Spinner /> : t('auth.resetSubmit')}
          </Button>

          {/** Mistyped the address, or the code never came. */}
          <button
            type="button"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            onClick={() => {
              setStep('email');
              setError(null);
              setCode('');
            }}
          >
            {t('auth.resetWrongEmail')}
          </button>
        </form>
      )}

      <ModalFooter>
        <button
          type="button"
          className="hover:text-[var(--color-primary)]"
          onClick={() => dispatch(openGlobalModal({ type: 'login' }))}
        >
          <Text className="text-[1.125rem]">{t('auth.resetBackToLogin')}</Text>
        </button>
      </ModalFooter>
    </ModalBody>
  );
};

export default ResetPasswordModalPanel;
