import { PracticeElementKind } from "../../generated/prisma/enums";

/**
 * Which questions may actually be put to a student right now.
 *
 * A question about a recording cannot honestly be asked before the recording exists. The
 * row and the file arrive separately - the CSV names the mp3, the mp3 is uploaded
 * afterwards - and in between there is an element with nothing to play. A student answering
 * then is guessing about something they could not hear.
 *
 * This lived inline where the quiz is served, and nowhere else. Marking read every published
 * question of the material instead, which meant a test was scored out of questions it had
 * never shown: thirteen points asked, eighteen points marked, and a pass turned into a fail
 * by five questions that were never on the screen. The rule now has one home, and both the
 * asking and the marking read it.
 */
export type ElementOfQuestion = {
  kind: PracticeElementKind;
  audioUrl: string | null;
};

export const isAwaitingAudio = (element: ElementOfQuestion): boolean =>
  element.kind === PracticeElementKind.audio && !element.audioUrl;

/** Ids of the elements that exist but cannot be worked on yet. */
export const awaitingAudioIds = (
  elements: ReadonlyArray<{ id: string } & ElementOfQuestion>,
): Set<string> =>
  new Set(elements.filter(isAwaitingAudio).map((element) => element.id));

/**
 * Drops the questions about a recording that is not there yet.
 *
 * A question attached to nothing, or to a text, is always askable - only a silent recording
 * holds anything back.
 */
export const askableQuestions = <T extends { elementId: string | null }>(
  questions: readonly T[],
  awaiting: ReadonlySet<string>,
): T[] =>
  questions.filter(
    (question) => !question.elementId || !awaiting.has(question.elementId),
  );
