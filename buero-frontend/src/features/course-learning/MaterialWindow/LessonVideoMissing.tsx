import React from 'react';
import { useTranslation } from 'react-i18next';
import { VideoOff } from 'lucide-react';

export type LessonVideoMissingProps = {
  className?: string;
};

/**
 * A video lesson whose YouTube link was never filled in.
 *
 * This replaces a fallback that played a hard-coded video - Rick Astley, as it happens -
 * whenever the field came back empty. The lesson therefore looked finished and played the
 * wrong thing, on a course someone had paid for, and nothing in the editor or the server
 * logs said a word about it.
 *
 * A lesson written before its recording exists is not an error; it is the normal shape of a
 * course being made, the same way a listening task arrives before its mp3 does. So this
 * says so in the student's language, and the author can see at a glance which lesson is
 * still waiting.
 */
const LessonVideoMissing: React.FC<LessonVideoMissingProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div
      data-testid="video-missing"
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-[#2a2a2a] px-6 text-center ${className}`}
    >
      <VideoOff className="h-8 w-8 text-white/40" aria-hidden />
      <p className="text-base font-medium text-white/85">{t('coursePage.videoMissing')}</p>
      <p className="max-w-sm text-sm text-white/55">{t('coursePage.videoMissingHint')}</p>
    </div>
  );
};

export default LessonVideoMissing;
