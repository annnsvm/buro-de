import React from 'react';

/**
 * A tab with a sheet attached to it.
 *
 * The mockups use this one shape for every piece of material a task hangs on: the recording in
 * Hören, the text in Lesen, the model answer in Sprechen, the criteria and the earlier attempts
 * in Schreiben. The tab carries the name, and anything else that belongs to the whole sheet -
 * a score, a show/hide control - sits beside it rather than inside the body.
 */

type FolderProps = {
  /** What is on the tab. Usually the author's own title for the material. */
  tab: React.ReactNode;
  /** Shown on the same line as the tab, pushed to the right: a score, a toggle. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const Folder: React.FC<FolderProps> = ({ tab, aside, children, className }) => (
  <section className={className}>
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div className="flex h-11 items-center rounded-t-2xl bg-[var(--color-surface-section)] px-[18px] text-sm font-semibold text-[var(--color-lesson-body)]">
        {tab}
      </div>
      {aside ? <div className="pb-2">{aside}</div> : null}
    </div>
    <div className="rounded-b-[18px] rounded-tr-[18px] border-[1.5px] border-[var(--color-surface-section)] bg-[var(--color-neutral-white)] p-6">
      {children}
    </div>
  </section>
);

export default Folder;
