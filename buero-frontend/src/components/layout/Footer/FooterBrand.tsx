import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Logo } from '@/components/ui';
import { ROUTES } from '@/helpers/routes';

const inputClass =
  'min-w-0 w-full max-w-[340px] flex-1 rounded-[12px] border border-[var(--color-neutral-lighter)] bg-transparent px-4 py-2.5 text-[0.9375rem] text-[var(--color-neutral-white)] placeholder:text-[var(--color-neutral-base)] transition-colors hover:border-[var(--color-neutral-light)] focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-0';
const submitBtnClass = 'shrink-0 rounded-[100px] px-5 py-2.5';

const TAGLINE =
  'Learn German. Live German. Your path to language mastery and cultural integration.';

const FooterBrand: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={ROUTES.HOME}
        className="inline-flex w-fit transition-opacity hover:opacity-80"
        aria-label="buero.de go to home"
      >
        <Logo width={70} height={28} />
      </Link>
      <p className="text-[0.9375rem] leading-[1.5] text-[var(--color-neutral-light)] max-w-[280px]">
        {TAGLINE}
      </p>
      <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            aria-label="Email for newsletter subscription"
          />
          <Button type="submit" variant="solid" className={submitBtnClass}>
            Subscribe
          </Button>
        </div>
        <p className="text-[0.75rem] leading-[1.4] text-[var(--color-neutral-base)]">
          By subscribing you agree to our{' '}
          <Link to="/privacy" className="underline hover:text-[var(--color-neutral-light)]">
            Privacy Policy
          </Link>{' '}
          and provide consent to receive updates from our company.
        </p>
      </form>
    </div>
  );
};

export default FooterBrand;
