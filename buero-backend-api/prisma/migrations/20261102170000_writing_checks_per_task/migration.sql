-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "writing_checks_per_task" INTEGER NOT NULL DEFAULT 3;

-- CreateTable
CREATE TABLE "writing_check_grants" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_material_id" TEXT NOT NULL,
    "practice_element_id" TEXT,
    "extra" INTEGER NOT NULL,
    "reason" TEXT,
    "granted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "writing_check_grants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "writing_check_grants_user_id_course_material_id_practice_el_idx" ON "writing_check_grants"("user_id", "course_material_id", "practice_element_id");

-- AddForeignKey
ALTER TABLE "writing_check_grants" ADD CONSTRAINT "writing_check_grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_check_grants" ADD CONSTRAINT "writing_check_grants_course_material_id_fkey" FOREIGN KEY ("course_material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_check_grants" ADD CONSTRAINT "writing_check_grants_practice_element_id_fkey" FOREIGN KEY ("practice_element_id") REFERENCES "practice_elements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_check_grants" ADD CONSTRAINT "writing_check_grants_granted_by_id_fkey" FOREIGN KEY ("granted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

