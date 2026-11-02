-- AlterTable
ALTER TABLE "writing_submissions" ADD COLUMN     "cache_read_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "cache_write_tokens" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "model" TEXT;

