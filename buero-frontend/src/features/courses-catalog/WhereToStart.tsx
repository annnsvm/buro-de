import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * What a visitor is asked, and which course each answer points at.
 *
 * Described by what a person can already do rather than by a level, because someone who
 * does not know whether they are A1 or A2 is exactly the person this is for. The options
 * are recognisable from the outside: "I know a few phrases" is answerable, "I am A2" is
 * not.
 *
 * Levels are named here, not course ids: a course is found by its level, so adding A2.2
 * later needs no change. The starting level is what the answer really establishes.
 */
const STARTING_POINTS = [
  { id: 'zero', level: 'A1' },
  { id: 'basics', level: 'A2' },
  { id: 'speaking', level: 'B1' },
] as const;

export type WhereToStartProps = {
  /** Levels that some course covers, so an answer never points at nothing. */
  availableLevels: readonly string[];
  /** Applies the answer as a level filter, which is what highlights the course below. */
  onChoose: (level: string | null) => void;
  chosenLevel: string | null;
};

/**
 * "Where do I start?" — the question the catalogue exists to answer.
 *
 * Three taps, no grading, no account. It ends by pointing at a course to *begin free*
 * rather than to buy: the trial is permanent and covers the first two modules, so a person
 * who has just admitted they do not know their level can find out at no cost. That is also
 * why this does not need to be accurate — only pointed in the right direction. If it is a
 * level out, the course itself says so within a lesson, for free.
 *
 * Deliberately not a placement test. It asks about the person, grades nothing, and gates
 * nothing.
 */
const WhereToStart: FC<WhereToStartProps> = ({
  availableLevels,
  onChoose,
  chosenLevel,
}) => {
  const { t } = useTranslation();
  const [answered, setAnswered] = useState<string | null>(null);

  const options = STARTING_POINTS.filter((point) =>
    availableLevels.includes(point.level),
  );
  if (options.length < 2) return null;

  const active = options.find(
    (option) => option.id === answered && option.level === chosenLevel,
  );

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4 rounded-[28px] border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:p-7">
      <p className="text-xl font-bold tracking-[-0.03em] text-white">
        {t('courses.whereToStart.title')}
      </p>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap">
        {options.map((option) => {
          const isActive = option.id === active?.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                /** Pressing the chosen answer again clears it and shows everything. */
                const next = isActive ? null : option;
                setAnswered(next?.id ?? null);
                onChoose(next?.level ?? null);
              }}
              className={[
                'rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors',
                isActive
                  ? 'border-white bg-white text-[var(--color-cod-gray-base)]'
                  : 'border-white/35 bg-white/10 text-white hover:border-white/60 hover:bg-white/15',
              ].join(' ')}
            >
              {t(`courses.whereToStart.options.${option.id}`)}
            </button>
          );
        })}
      </div>

      <p
        className="text-sm leading-relaxed text-white/75"
        aria-live="polite"
      >
        {active
          ? t(`courses.whereToStart.answers.${active.id}`)
          : t('courses.whereToStart.hint')}
      </p>
    </div>
  );
};

export default WhereToStart;
