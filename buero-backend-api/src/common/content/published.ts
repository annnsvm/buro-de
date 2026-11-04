/**
 * What a student is allowed to see.
 *
 * A question or a text exists from the moment it is imported, and is visible from the
 * moment the teacher publishes it. Those are two different events, and everything a
 * student reads has to ask for the second one.
 *
 * Kept as one exported fragment rather than written out at each call site, because there
 * are a dozen of them across four services and the cost of missing one is a draft on a
 * student's screen. Grep for the name to find every place that answers this question.
 */
export const PUBLISHED = { publishedAt: { not: null } } as const;
