type TextProps = {
    /**
     * An accessible name, where the text alone is not one.
     *
     * Optional, because an `aria-label` *replaces* the visible words for anyone using a
     * screen reader - so a paragraph that already reads well needs none, and one labelled
     * in another language than it is written in is read out in that other language.
     */
    label?: string;
    className?: string;
    children: React.ReactNode;
}

export type { TextProps }
