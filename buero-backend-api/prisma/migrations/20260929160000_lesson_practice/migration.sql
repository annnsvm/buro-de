-- CreateEnum
CREATE TYPE "PracticeBlock" AS ENUM ('grammatik', 'lesen', 'horen', 'sprechen');

-- AlterEnum
ALTER TYPE "CourseMaterialType" ADD VALUE 'practice';

-- AlterTable
ALTER TABLE "course_materials" ADD COLUMN     "parent_material_id" TEXT;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "block" "PracticeBlock" NOT NULL DEFAULT 'grammatik';

-- CreateIndex
CREATE INDEX "course_materials_parent_material_id_idx" ON "course_materials"("parent_material_id");

-- AddForeignKey
ALTER TABLE "course_materials" ADD CONSTRAINT "course_materials_parent_material_id_fkey" FOREIGN KEY ("parent_material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

