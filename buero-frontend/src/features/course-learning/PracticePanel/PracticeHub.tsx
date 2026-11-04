import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PracticeBlockSummary, PracticeOverview } from '@/api/practiceApi';
import { encouragementFor, spellBlockCount } from './encouragement';
import BlockThumb from './ui/BlockThumb';
import Segments from './ui/Segments';
import { PRIMARY_BUTTON } from './ui/buttons';
import { EYEBROW, EYEBROW_ACCENT, LABEL_ROW, SCREEN_TITLE, SECTION_TITLE } from './ui/headings';

export type PracticeHubProps = {
  overview: PracticeOverview;
  onOpenBlock: (block: PracticeBlockSummary['block']) => void;
  /** Offered whatever the state, but only live once every block is done. */
  onMoveOn?: () => void;
  nextStepLabel: string;
};

/**
 * The hub a student picks a block from.
 *
 * The blocks are split the way they are counted: the three that decide whether the lesson is
 * behind you, then the two that do not. They used to sit in one list with a badge on two of
 * them, which asked the student to hold the rule in their head while reading five rows; the
 * heading says it once instead, above the rows it applies to.
 */
const PracticeHub: React.FC<PracticeHubProps> = ({
  overview,
  onOpenBlock,
  onMoveOn,
  nextStepLabel,
}) => {
  const { t, i18n } = useTranslation();

  const encouragement = encouragementFor(overview.total_count, overview.done_count);
  /**
   * Where this practice sits, said in two pieces rather than one run-on line.
   *
   * The module and the lesson are different kinds of fact, so they are told apart by weight
   * and colour and a wide gap - the way the landing page sets its labels - instead of being
   * strung together with a separator character.
   */
  const trail = [overview.module_title, overview.lesson_title].filter(Boolean);

  const required = overview.blocks.filter((entry) => !entry.optional);
  const optional = overview.blocks.filter((entry) => entry.optional);

  /**
   * The parenthetical half of a title set back a step in colour.
   *
   * "2.1 - Кому цей подарунок? (Dativ: артиклі)" is a name and a grammar point: the first is
   * what the student came for, the second is what it teaches. Splitting on the author's own
   * bracket keeps her wording exactly and only changes how much of it shouts.
   */
  const title = overview.title || t('practice.title');
  const bracket = title.indexOf(' (');
  const head = bracket === -1 ? title : title.slice(0, bracket);
  const tail = bracket === -1 ? null : title.slice(bracket + 1);

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-7 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-3">
        {trail.length > 0 ? (
          <p className={LABEL_ROW}>
            <span className={EYEBROW_ACCENT}>{trail[0]}</span>
            {trail[1] ? <span className={EYEBROW}>{trail[1]}</span> : null}
          </p>
        ) : null}
        <h2 className={SCREEN_TITLE}>
          {head}
          {tail ? <span className="text-[var(--color-lesson-muted)]"> {tail}</span> : null}
        </h2>
        <p className="text-base text-[var(--color-lesson-muted)]">{t('practice.subtitle')}</p>
      </header>

      {/**
       * How much is behind, as a figure to glance at rather than a sentence to read: the big
       * number carries it, the label says what it counts, and the bar underneath shows it at
       * the width of the page so the gap left is visible without reading anything.
       */}
      <section className="flex flex-col gap-4 rounded-[22px] bg-[var(--color-surface-section)] px-6 py-5 sm:flex-row sm:items-center sm:gap-7">
        <p className="flex items-baseline gap-3 sm:flex-col sm:items-start sm:gap-0">
          <span className="font-[family-name:var(--font-heading)] text-[2.75rem] leading-none font-bold tracking-[-0.05em] text-[var(--color-lesson-accent)] tabular-nums sm:text-[3.25rem]">
            {overview.done_count}
            <span className="text-[var(--color-dawn-pink-dark)]">/{overview.total_count}</span>
          </span>
        </p>
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <span className="text-sm font-medium text-[var(--color-lesson-muted)]">
            {t('practice.requiredDone')}
          </span>
          <Segments
            filled={overview.done_count}
            total={overview.total_count}
            size="lg"
          />
        </div>
      </section>

      {/**
       * What the required blocks are actually for.
       *
       * The button to the next lesson used to be disabled until they were done, which said
       * something untrue: that the lesson was a gate. It is not - the blocks count towards the
       * course's own progress, and a student who wants to read on may. Saying so in a sentence
       * costs one line; leaving a dead button to say it cost the student the wrong idea.
       */}
      <p className="-mt-3 text-sm leading-relaxed text-[var(--color-lesson-muted)]">
        {t('practice.requiredPurpose')}
      </p>

      <BlockGroup
        heading={t('practice.groupRequired')}
        blocks={required}
        onOpenBlock={onOpenBlock}
      />

      {/**
       * Why the figure counts fewer blocks than the list shows, said above the rows it is
       * about. The sentence existed in the translations and was once never rendered at all,
       * leaving a student to reconcile "two required blocks left" with five cards.
       */}
      {optional.length > 0 ? (
        <BlockGroup
          heading={t('practice.groupOptional')}
          note={t('practice.optionalNote')}
          blocks={optional}
          onOpenBlock={onOpenBlock}
        />
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-dawn-pink-dark)]/35 pt-7">
        <p
          className="max-w-[440px] text-base leading-relaxed font-medium text-[var(--color-lesson-body)]"
          aria-live="polite"
        >
          {encouragement
            ? t(`practice.encouragement.${encouragement.key}`, {
                count: encouragement.count,
                /** Only the opening line uses it; the rest ignore the extra value. */
                blocks: spellBlockCount(encouragement.count, i18n.language),
              })
            : ''}
        </p>

        {/**
         * Live whatever the state of the practice.
         *
         * It was disabled until every required block was done, which read as a lock on the
         * course: the student could not tell that the blocks count towards their progress
         * rather than towards permission to read the next lesson. Nothing here gates anything -
         * the test at the end of a module will, and that is a different screen.
         */}
        {onMoveOn ? (
          <button type="button" onClick={onMoveOn} className={PRIMARY_BUTTON}>
            {nextStepLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
};

/** One heading and the rows under it. */
const BlockGroup: React.FC<{
  heading: string;
  note?: string;
  blocks: PracticeBlockSummary[];
  onOpenBlock: (block: PracticeBlockSummary['block']) => void;
}> = ({ heading, note, blocks, onOpenBlock }) => {
  if (blocks.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className={SECTION_TITLE}>
          {heading}
        </h3>
        {note ? (
          <span className="text-sm text-[var(--color-lesson-muted)]">{note}</span>
        ) : null}
      </div>

      <ul className="flex flex-col gap-2.5">
        {blocks.map((entry) => (
          <li key={entry.block}>
            <BlockRow block={entry} onOpen={() => onOpenBlock(entry.block)} />
          </li>
        ))}
      </ul>
    </section>
  );
};

/** One block: what it holds, and where the student got to in it. */
const BlockRow: React.FC<{
  block: PracticeBlockSummary;
  onOpen: () => void;
}> = ({ block, onOpen }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full flex-wrap items-center gap-4 rounded-[20px] bg-[var(--color-neutral-white)] p-3.5 pr-5 text-left transition hover:bg-[var(--color-dawn-pink-light)] sm:flex-nowrap sm:gap-[18px]"
    >
      <BlockThumb block={block.block} done={block.done} />

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className={SECTION_TITLE}>
            {t(`practice.blocks.${block.block}.title`)}
          </span>
          {/** A block whose recordings have not been uploaded yet. */}
          {!block.ready ? (
            <span className="rounded-full bg-[var(--color-surface-section)] px-2.5 py-0.5 font-[family-name:var(--font-heading)] text-xs font-semibold text-[var(--color-lesson-muted)] sm:text-[13px]">
              {t('practice.awaitingBlock')}
            </span>
          ) : null}
        </span>
        {/* Described by what is actually in it, so the line stays true as the author adds. */}
        <span className="text-sm text-[var(--color-lesson-muted)]">
          {block.ready
            ? t(`practice.blocks.${block.block}.summary`, {
                count: block.total || block.task_count,
              })
            : t(`practice.blocks.${block.block}.description`)}
        </span>
      </span>

      <BlockState block={block} />
    </button>
  );
};

/**
 * What the right-hand end of a row says.
 *
 * Three different facts live there, and each needs its own shape. A letter is marked out of
 * its criteria; a quiz out of its questions; and a recording is not marked at all, so the one
 * honest thing to report is that it exists - counting its questions would announce a finished
 * speaking task as 0 of 0.
 */
const BlockState: React.FC<{ block: PracticeBlockSummary }> = ({ block }) => {
  const { t } = useTranslation();

  if (!block.done) {
    return (
      <span className={`${PRIMARY_BUTTON} ml-auto sm:ml-0`}>{t('practice.blockStart')}</span>
    );
  }

  if (!block.points && block.total === 0) {
    return (
      <span className="ml-auto text-sm font-semibold whitespace-nowrap text-[var(--color-lesson-accent)] sm:ml-0">
        {t('practice.recorded')}
      </span>
    );
  }

  const score = block.points
    ? `${block.points.score}/${block.points.max}`
    : `${block.correct}/${block.total}`;

  return (
    <span className="ml-auto flex flex-col items-end whitespace-nowrap sm:ml-0">
      <span className="font-[family-name:var(--font-heading)] text-2xl leading-none font-bold tracking-[-0.03em] text-[var(--color-lesson-accent)] tabular-nums">
        {score}
      </span>
      <span className="mt-1 text-xs text-[var(--color-lesson-muted)]">
        {block.points ? t('practice.pointsLabel') : t('practice.blockDone')}
      </span>
    </span>
  );
};

export default PracticeHub;
