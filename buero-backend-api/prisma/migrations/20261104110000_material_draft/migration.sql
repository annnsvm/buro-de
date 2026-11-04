-- A material of its own can now be a draft, not just the questions inside it.
--
-- Backfilled from created_at so every material that already exists stays exactly as visible
-- as it was: the column is about what happens to the next import, not about hiding work that
-- students can already see. Only rows created from here on start as null.
ALTER TABLE "course_materials" ADD COLUMN     "published_at" TIMESTAMP(3);

UPDATE "course_materials" SET "published_at" = "created_at" WHERE "published_at" IS NULL;

CREATE INDEX "course_materials_module_id_published_at_idx" ON "course_materials"("module_id", "published_at");
