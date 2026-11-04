export const deleteMaterialCopy = (params: {
  title: string;
  kind: 'video' | 'quiz' | 'other';
}): string => {
  const safeTitle = params.title.trim() || 'Без назви';
  if (params.kind === 'video') {
    return `Видалити відеоурок «${safeTitle}»?\nЦе не можна скасувати.`;
  }
  if (params.kind === 'quiz') {
    return `Видалити тест «${safeTitle}»?\nЦе не можна скасувати.`;
  }
  return `Видалити матеріал «${safeTitle}»?\nЦе не можна скасувати.`;
};
