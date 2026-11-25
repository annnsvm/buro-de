import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { Button, FormField, Input, PasswordInput, Spinner } from '@/components/ui';
import { ModalBody, ModalFooter, ModalHeader } from '@/components/modal';
import { Text } from '@/components/layout';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { authErrorText, authFailure } from '@/helpers/authErrorMessage';
import type { AuthFailure } from '@/helpers/authErrorMessage';
import { requestPasswordReset, resetPassword } from '@/api/passwordResetApi';

export type ResetPasswordModalPanelProps = {
  prefillEmail?: string;
  onDismiss: () => void;
};

/** The server's rule, checked here so a weak password costs no round trip. */
const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*[0-9]).{9,}$/;

/**
 * Getting back in after forgetting the password.
 *
 * Two steps rather than one screen with everything on it: the address, then the code and
 * the new password together. The student has to leave for their inbox between the two, and
 * a form that asked for all three at once would be a form they had to come back to with
 * half of it already stale.
 *
 * What this screen used to do badly was fail. The server answered "code sent" however the
 * first step went - unknown address, cooldown, anything - so the screen said a code was on
 * its way and then waited for digits that would never arrive. The second step was as blunt:
 * one sentence, "invalid or expired", for a code that had run out of time, a code with a
 * typo in it, and no code at all. Each of those wants something different done about it.
 *
 * So the server names each failure now and this screen answers with the way out rather than
 * only with words: an address with no account gets the sign-up button, a code that has
 * expired or been guessed away gets the button that asks for a new one, and a second ask
 * inside the cooldown goes straight on to the step that uses the code already sitting in
 * the inbox.
 */
const ResetPasswordModalPanel: React.FC<ResetPasswordModalPanelProps> = ({
  prefillEmail,
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(prefillEmail ?? '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Not a problem, just something worth knowing - a code already sent, or sent again. */
  const [notice, setNotice] = useState<string | null>(null);
  const [failure, setFailure] = useState<AuthFailure | null>(null);
  const [done, setDone] = useState(false);

  const locale = i18n.language === 'uk' ? 'uk' : 'en';

  const clearMessages = () => {
    setError(null);
    setNotice(null);
    setFailure(null);
  };

  /**
   * Asks the server for a code. Answers whether the screen may move on to using one.
   *
   * A refusal inside the cooldown counts as "yes": nothing new was sent, but a code from a
   * minute ago is in the inbox and the step that takes it is where the student needs to be.
   */
  const sendCode = async (): Promise<boolean> => {
    setBusy(true);
    clearMessages();
    try {
      await requestPasswordReset(email.trim(), locale);
      return true;
    } catch (err: unknown) {
      const kind = authFailure(err);
      setFailure(kind);
      if (kind === 'CODE_TOO_SOON') {
        setNotice(t('auth.errors.CODE_TOO_SOON'));
        return true;
      }
      setError(authErrorText(err, t, 'auth.resetRequestFailed'));
      return false;
    } finally {
      setBusy(false);
    }
  };

  const askForCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !email.trim()) return;
    if (await sendCode()) {
      setCode('');
      setStep('code');
    }
  };

  /** From the second step, when the code there turned out to be unusable. */
  const askForNewCode = async () => {
    if (busy) return;
    setCode('');
    const sent = await sendCode();
    if (sent) {
      setNotice((already) => already ?? t('auth.verifyResent'));
    }
  };

  const setNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !code.trim() || !password) return;

    /** Said here rather than fetched: the rule is on the screen already. */
    if (!PASSWORD_RULE.test(password)) {
      setNotice(null);
      setFailure(null);
      setError(t('auth.errors.VALIDATION_FAILED'));
      return;
    }

    setBusy(true);
    clearMessages();
    try {
      await resetPassword(email.trim(), code.trim(), password);
      setDone(true);
    } catch (err: unknown) {
      setFailure(authFailure(err));
      setError(authErrorText(err, t, 'auth.resetFailed'));
    } finally {
      setBusy(false);
    }
  };

  const goToSignUp = () => {
    dispatch(openGlobalModal({ type: 'signup', prefillEmail: email.trim() }));
  };

  /** The three refusals that are answered by a fresh code rather than by retyping. */
  const needsNewCode =
    failure === 'CODE_EXPIRED' ||
    failure === 'CODE_ATTEMPTS_SPENT' ||
    failure === 'CODE_NOT_REQUESTED';

  const FIELD =
    'rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]';

  const messages = (
    <>
      {error ? <p className="text-[var(--color-error)]">{error}</p> : null}
      {notice ? (
        <p className="text-[var(--color-text-secondary)]">{notice}</p>
      ) : null}
    </>
  );

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
          onClick={() => dispatch(openGlobalModal({ type: 'login', prefillEmail: email.trim() }))}
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
          step === 'email'
            ? t('auth.resetDescription')
            : t('auth.resetCodeSent', { email: email.trim() })
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
              onChange={(event) => {
                setEmail(event.target.value);
                clearMessages();
              }}
              placeholder={t('auth.email')}
              autoComplete="email"
              autoFocus
              className={FIELD}
            />
          </FormField>

          {messages}

          {/**
           * Nobody is on this address, so there is no password to reset and no point
           * offering to send anything again. The screen that helps is the other one.
           */}
          {failure === 'ACCOUNT_NOT_FOUND' ? (
            <button
              type="button"
              className="self-start text-sm font-medium text-[var(--color-primary)] underline"
              onClick={goToSignUp}
            >
              {t('auth.goSignUp')}
            </button>
          ) : null}

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

          {messages}

          {needsNewCode ? (
            <button
              type="button"
              className="self-start text-sm font-medium text-[var(--color-primary)] underline disabled:opacity-50"
              onClick={askForNewCode}
              disabled={busy}
            >
              {t('auth.resetRequestNewCode')}
            </button>
          ) : null}

          {failure === 'ACCOUNT_NOT_FOUND' ? (
            <button
              type="button"
              className="self-start text-sm font-medium text-[var(--color-primary)] underline"
              onClick={goToSignUp}
            >
              {t('auth.goSignUp')}
            </button>
          ) : null}

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
              clearMessages();
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
          onClick={() => dispatch(openGlobalModal({ type: 'login', prefillEmail: email.trim() }))}
        >
          <Text className="text-[1.125rem]">{t('auth.resetBackToLogin')}</Text>
        </button>
      </ModalFooter>
    </ModalBody>
  );
};

export default ResetPasswordModalPanel;
