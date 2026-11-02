import React from 'react';

/**
 * A question with a gap in it, drawn as a line rather than as a row of underscores.
 *
 * The author writes the gap as "___" because that is what a spreadsheet can hold. On screen a
 * run of underscores reads as a typo or as a redaction; a ruled line reads as somewhere to
 * write. Nothing about her text changes - only how the gap is painted.
 */

/** Two or more underscores. One is a legitimate character in a word. */
const GAP = /_{2,}/g;

const GapPrompt: React.FC<{ text: string }> = ({ text }) => {
  const pieces = text.split(GAP);
  if (pieces.length === 1) return <>{text}</>;

  return (
    <>
      {pieces.map((piece, index) => (
        <React.Fragment key={index}>
          {piece}
          {index < pieces.length - 1 ? (
            <span
              aria-hidden
              /**
               * Blank space with a rule under it, sitting on the line of the text.
               *
               * Drawn as a floating bar first, which put a dash through the middle of the
               * sentence - "Ich danke - Mutter" reads as a dash, not as somewhere to write.
               * A non-breaking space inside gives the span the height of the line, so the
               * border lands where an underscore would.
               */
              className="mx-1 inline-block min-w-16 border-b-2 border-[var(--color-accent-primary)]"
            >
              &nbsp;
            </span>
          ) : null}
        </React.Fragment>
      ))}
    </>
  );
};

export default GapPrompt;
