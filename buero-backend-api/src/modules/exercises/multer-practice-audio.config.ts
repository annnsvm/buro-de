import { BadRequestException } from "@nestjs/common";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

/**
 * What a browser will actually play.
 *
 * Deliberately short: a recording the student cannot hear is worse than one that was
 * refused at upload, and the formats outside this list are the ones Safari or Firefox
 * quietly decline. mp3 covers everything the author is likely to have.
 */
export const PRACTICE_AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/aac",
  "audio/webm",
] as const;

/**
 * Generous for speech: a three-minute listening task at a decent bitrate is about 3 MB,
 * so this leaves room for an uncompressed file without inviting a whole lecture.
 */
export const PRACTICE_AUDIO_MAX_BYTES = 15 * 1024 * 1024;

export const practiceAudioMulterOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: PRACTICE_AUDIO_MAX_BYTES },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed = PRACTICE_AUDIO_MIME_TYPES as readonly string[];
    if (!allowed.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          "Непідтримуваний формат. Дозволено: MP3, OGG, WAV, M4A, AAC, WebM.",
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
