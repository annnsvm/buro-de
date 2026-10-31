-- CreateTable
CREATE TABLE "lesson_notes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_material_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lesson_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lesson_notes_user_id_updated_at_idx" ON "lesson_notes"("user_id", "updated_at");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_notes_user_id_course_material_id_key" ON "lesson_notes"("user_id", "course_material_id");

-- AddForeignKey
ALTER TABLE "lesson_notes" ADD CONSTRAINT "lesson_notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_notes" ADD CONSTRAINT "lesson_notes_course_material_id_fkey" FOREIGN KEY ("course_material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

