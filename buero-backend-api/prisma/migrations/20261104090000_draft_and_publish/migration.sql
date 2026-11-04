-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "published_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "practice_elements" ADD COLUMN     "published_at" TIMESTAMP(3);

-- Everything that already exists is already on screen.
--
-- The column means "visible to students", and every question and every text in the
-- database today is visible: it has been served to anyone who opened the lesson. Leaving
-- them null would have emptied every course on the morning of the deploy, which is the one
-- way this change could do real harm. Backfilled from `created_at` rather than from now(),
-- so the record says when the material actually appeared.
UPDATE "questions" SET "published_at" = "created_at" WHERE "published_at" IS NULL;
UPDATE "practice_elements" SET "published_at" = "created_at" WHERE "published_at" IS NULL;

-- Read on every student request: "this material's published questions, in order".
CREATE INDEX "questions_material_id_published_at_idx" ON "questions"("material_id", "published_at");
CREATE INDEX "practice_elements_material_id_published_at_idx" ON "practice_elements"("material_id", "published_at");
