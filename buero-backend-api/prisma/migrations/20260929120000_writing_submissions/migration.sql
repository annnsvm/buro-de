-- AlterEnum
ALTER TYPE "CourseMaterialType" ADD VALUE 'writing';

-- CreateTable
CREATE TABLE "writing_submissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_material_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "text_hash" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL,
    "assessment" JSONB NOT NULL,
    "input_tokens" INTEGER NOT NULL,
    "output_tokens" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "writing_submissions_user_id_course_material_id_created_at_idx" ON "writing_submissions"("user_id", "course_material_id", "created_at");

-- CreateIndex
CREATE INDEX "writing_submissions_user_id_created_at_idx" ON "writing_submissions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "writing_submissions_created_at_idx" ON "writing_submissions"("created_at");

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_course_material_id_fkey" FOREIGN KEY ("course_material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
