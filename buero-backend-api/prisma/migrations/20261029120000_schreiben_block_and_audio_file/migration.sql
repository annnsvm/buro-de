-- Schreiben as a fifth practice block, and the name of the recording a row expects.
--
-- Two new enum values and one nullable column. Neither value is used by any existing row, so
-- both can be added inside the same transaction as the column, and nothing is rewritten.
ALTER TYPE "PracticeBlock" ADD VALUE 'schreiben';

ALTER TYPE "PracticeElementKind" ADD VALUE 'write';

-- An audio arrives in two halves: the CSV row that describes it, and the mp3 uploaded later.
-- This holds the file name the row asked for until the file itself turns up.
ALTER TABLE "practice_elements" ADD COLUMN "audio_file_name" TEXT;
