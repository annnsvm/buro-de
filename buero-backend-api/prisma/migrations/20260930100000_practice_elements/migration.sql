-- CreateEnum
CREATE TYPE "PracticeElementKind" AS ENUM ('text', 'audio', 'rec');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "element_id" TEXT;

-- CreateTable
CREATE TABLE "practice_elements" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "block" "PracticeBlock" NOT NULL,
    "kind" "PracticeElementKind" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "audio_url" TEXT,
    "transcript" TEXT,
    "sample_answer" TEXT,
    "hints" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_elements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "practice_elements_material_id_block_order_index_idx" ON "practice_elements"("material_id", "block", "order_index");

-- CreateIndex
CREATE INDEX "questions_element_id_idx" ON "questions"("element_id");

-- AddForeignKey
ALTER TABLE "practice_elements" ADD CONSTRAINT "practice_elements_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_element_id_fkey" FOREIGN KEY ("element_id") REFERENCES "practice_elements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

