-- A writing task that lives inside a practice block, with its rubric on the task itself.
--
-- Additive only: four columns, one foreign key and one index. No row is read or rewritten, and
-- a writing material that already exists keeps working untouched — `practice_element_id` stays
-- NULL for every letter written against one.

-- Which task a letter answers, when it answers one inside a practice. A practice may hold
-- several, so the attempt window has to be per task: counting by material alone would let one
-- letter spend another's attempts.
-- AlterTable
ALTER TABLE "writing_submissions" ADD COLUMN     "practice_element_id" TEXT;

-- `criteria` is the rubric the author wrote, one sentence each, in her order — on the task
-- rather than in code because every module brings its own. The sentence range is counted, never
-- judged by the grader.
-- AlterTable
ALTER TABLE "practice_elements" ADD COLUMN     "criteria" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "max_sentences" INTEGER,
ADD COLUMN     "min_sentences" INTEGER;

-- CreateIndex
CREATE INDEX "writing_submissions_user_id_practice_element_id_created_at_idx" ON "writing_submissions"("user_id", "practice_element_id", "created_at");

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_practice_element_id_fkey" FOREIGN KEY ("practice_element_id") REFERENCES "practice_elements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
