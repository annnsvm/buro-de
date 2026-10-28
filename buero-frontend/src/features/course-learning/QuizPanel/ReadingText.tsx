import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeElement } from '@/api/quizApi';

export type ReadingTextProps = {
  element: PracticeElement;
};

/**
 * The text a set of questions is about, kept in view while they are answered.
 *
 * Sticky rather than simply placed above them: a reading task where the text scrolls out of sight
 * stops testing reading and starts testing memory. On a narrow screen it can be folded away, for
 * the moment when the student has read it and wants the questions to fill the screen — their
 * choice, and it opens again in one tap.
 */
const ReadingText: React.FC<ReadingTextProps> = ({ element }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="sticky top-0 z-10 -mx-4 mb-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-soapstone-base)]/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-bold text-[var(--color-text-primary)]">
          {element.title}
        </h3>
        <button
          type="button"
          onClick={() => setCollapsed((open) => !open)}
          aria-expanded={!collapsed}
          className="shrink-0 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
        >
          {collapsed ? t('practice.showText') : t('practice.hideText')}
        </button>
      </div>

      {!collapsed && element.body ? (
        <p className="mt-3 max-h-[42vh] overflow-y-auto text-sm leading-relaxed whitespace-pre-line text-[var(--color-text-primary)]">
          {element.body}
        </p>
      ) : null}
    </section>
  );
};

export default ReadingText;
