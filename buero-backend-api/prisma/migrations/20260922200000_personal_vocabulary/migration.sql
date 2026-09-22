-- CreateEnum
CREATE TYPE "VocabularyCategory" AS ENUM ('vocabulary', 'idiom', 'phrase', 'grammar', 'other');

-- DropTable
DROP TABLE "vocabulary";

-- CreateTable
CREATE TABLE "user_vocabulary_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT,
    "word" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "category" "VocabularyCategory" NOT NULL DEFAULT 'vocabulary',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_vocabulary_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_vocabulary_entries_user_id_created_at_idx" ON "user_vocabulary_entries"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_vocabulary_entries_user_id_word_key" ON "user_vocabulary_entries"("user_id", "word");

-- AddForeignKey
ALTER TABLE "user_vocabulary_entries" ADD CONSTRAINT "user_vocabulary_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vocabulary_entries" ADD CONSTRAINT "user_vocabulary_entries_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

