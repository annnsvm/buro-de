import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeElement } from '@/api/quizApi';
import Folder from '@/features/course-learning/PracticePanel/ui/Folder';
import { parseReadingText } from './glossary';

export type ReadingTextProps = {
  element: PracticeElement;
};

/**
 * The text a set of questions is about, kept in view while they are answered.
 *
 * Sticky rather than simply placed above them: a reading task where the text scrolls out of
 * sight stops testing reading and starts testing memory. It can be folded away for the moment
 * when the student has read it and wants the questions to fill the screen - their choice, and
 * it opens again in one tap.
 *
 * The author's word list is lifted out of the body and set as chips beneath it. Run into the
 * text it read as one more German paragraph; on its own it is what it is, something to glance
 * at mid-sentence without losing the line.
 */
const ReadingText: React.FC<ReadingTextProps> = ({ element }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const { body, glossary } = useMemo(
    () => parseReadingText(element.body),
    [element.body],
  );

  return (
    <section className="sticky top-0 z-10 mb-6 pt-2">
      <Folder
        tab={element.title}
        aside={
          <button
            type="button"
            onClick={() => setCollapsed((open) => !open)}
            aria-expanded={!collapsed}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
          >
            {collapsed ? t('practice.showText') : t('practice.hideText')}
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className={[
                'size-4 transition-transform',
                collapsed ? '' : 'rotate-180',
              ].join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        }
      >
        {collapsed ? null : (
          <div className="max-h-[42vh] overflow-y-auto">
            {body ? (
              <p className="leading-[1.7] whitespace-pre-line text-[var(--color-text-primary)]">
                {body}
              </p>
            ) : null}

            {glossary.length > 0 ? (
              <div className="mt-5 border-t border-dashed border-[var(--color-surface-section)] pt-4">
                <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase">
                  {t('practice.glossary')}
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {glossary.map((entry) => (
                    <li
                      key={entry.term}
                      className="rounded-2xl bg-[var(--color-burnt-siena-lightest)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        {entry.term}
                      </span>
                      {entry.meaning ? ` - ${entry.meaning}` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </Folder>
    </section>
  );
};

export default ReadingText;
