export const deleteModuleCopy = (params: {
  videoLessons: number;
  quizzes: number;
  otherMaterials: number;
}): string => {
  const { videoLessons, quizzes, otherMaterials } = params;
  /**
   * Counted after the colon rather than before the noun, because Ukrainian declines the noun
   * by the number and «1 відеоурок / 2 відеоуроки / 5 відеоуроків» is three forms to get wrong
   * in a sentence nobody reads twice.
   */
  const lines: string[] = [`У модулі відеоуроків: ${videoLessons}, тестів: ${quizzes}.`];
  if (otherMaterials > 0) {
    lines.push(`Інших матеріалів: ${otherMaterials}.`);
  }
  lines.push('Разом із модулем зникнуть усі його матеріали. Це не можна скасувати.');
  return lines.join('\n\n');
};
