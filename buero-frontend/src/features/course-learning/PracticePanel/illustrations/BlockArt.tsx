import React from 'react';

/**
 * One drawing per block, as the author supplied them.
 *
 * Inline rather than an <img>, for two reasons: the lettering inside picks up the product's own
 * heading font instead of whatever the file names, and the coral is the interface accent rather
 * than a hex of its own - a drawing in a slightly different orange next to a button in ours is
 * exactly the kind of seam the author asked to avoid.
 *
 * Everything else - the yellow, the blue, the green, the paper - is artwork and stays as drawn.
 */

const CORAL = 'var(--color-accent-primary)';
const INK = '#1F1A17';
const HEADING = 'var(--font-heading)';

type ArtProps = {
  /** Drawn at 190x170; the thumbnail on the hub asks for a smaller one. */
  size?: number;
  className?: string;
};

const frame = ({ size = 190, className }: ArtProps) => ({
  width: size,
  height: Math.round((size / 190) * 170),
  viewBox: '0 0 190 170',
  xmlns: 'http://www.w3.org/2000/svg',
  'aria-hidden': true as const,
  focusable: 'false' as const,
  className,
});

export const GrammatikArt: React.FC<ArtProps> = (props) => (
  <svg {...frame(props)}>
    <path d="M24 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#F2B33D" />
    <path d="M168 14l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#F2B33D" />
    <circle cx="166" cy="70" r="5" fill="#8FB8F0" />
    <circle cx="18" cy="96" r="4" fill="#9BD3AE" />
    <g transform="rotate(-8 60 122)">
      <rect x="28" y="92" width="64" height="64" rx="14" fill={CORAL} />
      <text x="60" y="131" textAnchor="middle" fontFamily={HEADING} fontWeight="800" fontSize="22" fill="#FFFFFF">die</text>
    </g>
    <g transform="rotate(7 128 126)">
      <rect x="96" y="94" width="64" height="64" rx="14" fill="#9BD3AE" stroke={INK} strokeWidth="2" />
      <text x="128" y="133" textAnchor="middle" fontFamily={HEADING} fontWeight="800" fontSize="22" fill={INK}>das</text>
    </g>
    <g transform="rotate(-4 94 62)">
      <rect x="62" y="30" width="64" height="64" rx="14" fill="#8FB8F0" stroke={INK} strokeWidth="2" />
      <text x="94" y="69" textAnchor="middle" fontFamily={HEADING} fontWeight="800" fontSize="22" fill={INK}>der</text>
    </g>
  </svg>
);

export const LesenArt: React.FC<ArtProps> = (props) => (
  <svg {...frame(props)}>
    <path d="M26 24l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2B33D" />
    <circle cx="170" cy="30" r="5" fill="#9BD3AE" />
    <path d="M14 60v90c30-8 60-6 81 6 21-12 51-14 81-6V60z" fill={CORAL} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M95 62C75 50 45 48 22 54v88c23-6 53-4 73 8z" fill="#FFFFFF" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M95 62c20-12 50-14 73-8v88c-23-6-53-4-73 8z" fill="#FBE7C6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    <path d="M34 76c16-4 34-3 48 2M34 92c16-4 34-3 48 2M34 108c16-4 34-3 48 2M34 124c12-3 24-2 34 1" fill="none" stroke="#E0D4CC" strokeWidth="3" strokeLinecap="round" />
    <path d="M108 78c14-5 32-6 48-2M108 94c14-5 32-6 48-2M108 110c14-5 32-6 48-2" fill="none" stroke="#E8C99A" strokeWidth="3" strokeLinecap="round" />
    <path d="M140 46v40l8-7 8 7V48z" fill="#8FB8F0" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const HoerenArt: React.FC<ArtProps> = (props) => (
  <svg {...frame(props)}>
    <path d="M30 26l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2B33D" />
    <circle cx="160" cy="34" r="5" fill="#8FB8F0" />
    <path d="M52 112V92a43 43 0 0 1 86 0v20" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" />
    <rect x="36" y="96" width="32" height="52" rx="13" fill={CORAL} stroke={INK} strokeWidth="2" />
    <rect x="122" y="96" width="32" height="52" rx="13" fill={CORAL} stroke={INK} strokeWidth="2" />
    <path d="M166 106q8 16 0 32" fill="none" stroke="#F2B33D" strokeWidth="4" strokeLinecap="round" />
    <path d="M177 98q14 24 0 48" fill="none" stroke="#F2B33D" strokeWidth="4" strokeLinecap="round" />
    <path d="M24 106q-8 16 0 32" fill="none" stroke="#9BD3AE" strokeWidth="4" strokeLinecap="round" />
    <path d="M13 98q-14 24 0 48" fill="none" stroke="#9BD3AE" strokeWidth="4" strokeLinecap="round" />
    <circle cx="88" cy="76" r="7" fill={INK} />
    <path d="M95 76V50l14 5" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SprechenArt: React.FC<ArtProps> = (props) => (
  <svg {...frame(props)}>
    <path d="M168 18l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#F2B33D" />
    <circle cx="18" cy="150" r="5" fill="#8FB8F0" />
    <g transform="rotate(-5 75 72)">
      <path d="M34 40h82a14 14 0 0 1 14 14v36a14 14 0 0 1-14 14H58l-18 16v-16h-6a14 14 0 0 1-14-14V54a14 14 0 0 1 14-14z" fill={CORAL} stroke={INK} strokeWidth="2" />
      <text x="75" y="80" textAnchor="middle" fontFamily={HEADING} fontWeight="800" fontSize="22" fill="#FFFFFF">Hallo!</text>
    </g>
    <g transform="rotate(4 125 122)">
      <path d="M90 96h70a14 14 0 0 1 14 14v24a14 14 0 0 1-14 14h-2v16l-18-16H90a14 14 0 0 1-14-14v-24a14 14 0 0 1 14-14z" fill="#FFFFFF" stroke={INK} strokeWidth="2" />
      <circle cx="111" cy="122" r="5" fill={CORAL} />
      <circle cx="125" cy="122" r="5" fill="#F2B33D" />
      <circle cx="139" cy="122" r="5" fill="#9BD3AE" />
    </g>
  </svg>
);

export const SchreibenArt: React.FC<ArtProps> = (props) => (
  <svg {...frame(props)}>
    <path d="M26 28l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2B33D" />
    <circle cx="20" cy="150" r="5" fill="#9BD3AE" />
    <g transform="rotate(-6 85 110)">
      <rect x="22" y="72" width="124" height="80" rx="10" fill="#FBE7C6" stroke={INK} strokeWidth="2" />
      <path d="M26 76l58 42 58-42" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="84" cy="118" r="10" fill={CORAL} stroke={INK} strokeWidth="2" />
    </g>
    <g transform="rotate(35 146 70)">
      <rect x="136" y="14" width="20" height="84" rx="3" fill="#F2B33D" stroke={INK} strokeWidth="2" />
      <rect x="136" y="14" width="20" height="16" rx="3" fill={CORAL} stroke={INK} strokeWidth="2" />
      <path d="M136 98l10 22 10-22z" fill="#FBE7C6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M142.5 112.5l3.5 7.5 3.5-7.5z" fill={INK} />
    </g>
  </svg>
);

/** By block, so a screen asks for "the drawing for this block" and not for a file name. */
export const BLOCK_ART = {
  grammatik: GrammatikArt,
  lesen: LesenArt,
  horen: HoerenArt,
  sprechen: SprechenArt,
  schreiben: SchreibenArt,
} as const;
