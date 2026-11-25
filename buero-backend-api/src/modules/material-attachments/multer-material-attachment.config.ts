import { BadRequestException } from "@nestjs/common";
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { memoryStorage } from "multer";

export const MATERIAL_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
] as const;

export const MATERIAL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Nest's `MulterOptions` was written before `defParamCharset` existed, so it is declared
 * here. Multer itself reads the option - see `defParamCharset` in its `index.js` - and
 * `@types/multer` has carried it for years.
 */
type MulterOptionsWithCharset = MulterOptions & { defParamCharset?: string };

export const materialAttachmentMulterOptions: MulterOptionsWithCharset = {
  storage: memoryStorage(),
  limits: { fileSize: MATERIAL_ATTACHMENT_MAX_BYTES },
  /**
   * Read the uploaded file's name as UTF-8, which is what browsers send.
   *
   * Multer defaults this to `latin1` - `this.defParamCharset = options.defParamCharset ||
   * 'latin1'` - so every byte of a name outside ASCII is decoded as the wrong character.
   * A file called `Buro_de-A2.1-1.1-Shpargalka.pdf` survives that untouched, which is why
   * it looked fine; one called `Шпаргалка.pdf` arrives as mojibake and is stored that way,
   * so it is also what the student downloads later.
   */
  defParamCharset: "utf8",
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed = MATERIAL_ATTACHMENT_MIME_TYPES as readonly string[];
    if (!allowed.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          "Unsupported file type. Allowed: PDF, JPEG, PNG, WebP, GIF, Word, Excel, TXT, ZIP.",
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
};
