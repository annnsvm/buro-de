import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Logo } from '@/components/ui';
import useModal from '@/components/modal/context/useModal';
import { ROUTES } from '@/helpers/routes';

const inputClass =
  'min-w-0 w-full rounded-[12px] border border-[var(--color-neutral-lighter)] bg-transparent px-4 py-2.5 text-[0.9375rem] text-[var(--color-neutral-white)] placeholder:text-[var(--color-neutral-base)] transition-colors hover:border-[var(--color-neutral-light)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-0';
const contactBtnClass =
  'w-full shrink-0 rounded-[100px] px-5 py-2.5 sm:w-auto';

const TAGLINE =
  'Learn German. Live German. Your path to language mastery and cultural integration.';

const FooterBrand: React.FC = () => {
  const [email, setEmail] = useState('');
  const { pushUiModal } = useModal();

  const handleContactClick = () => {
    pushUiModal({
      type: 'contactSupport',
      prefillEmail: email.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.HOME}
        className="inline-flex w-fit transition-opacity hover:opacity-80"
        aria-label="buero.de go to home"
      >
        <Logo width={70} height={28} isLight/>
      </Link>
      <p className="text-[0.9375rem] leading-[1.5] text-[var(--color-neutral-light)] max-w-[280px]">
        {TAGLINE}
      </p>
      <div className="flex flex-col gap-6">
        <div className="flex max-w-[500px] flex-col items-start gap-6 sm:flex-row sm:gap-4">
          <div className="min-w-0 w-full flex-1">
            <Input
              id="footer-contact-email"
              type="email"
              placeholder="Enter your email"
              aria-label="Email for contact"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="button" variant="solid" className={contactBtnClass} onClick={handleContactClick}>
            Contact us
          </Button>
        </div>
        <p className="text-[0.75rem] leading-[1.4] text-[var(--color-neutral-base)]">
          By contacting us you agree to our{' '}
          <Link to="/privacy" className="underline hover:text-[var(--color-neutral-light)]">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default FooterBrand;
