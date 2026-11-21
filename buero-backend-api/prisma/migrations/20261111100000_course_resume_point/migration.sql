-- Where a student was last reading in a course.
--
-- "Continue" used to work off CourseProgress, which records what was *finished*. A student who
-- opened lesson 7, read half and closed the tab left no trace, so the card sent them back to the
-- first lesson they had not completed - often one they had already read past.
--
-- Purely additive: a new table, nothing existing is touched, and dropping it again loses only
-- the resume points themselves.

-- CreateTable
CREATE TABLE "course_resume_points" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "course_material_id" TEXT NOT NULL,
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_resume_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "course_resume_points_user_id_opened_at_idx" ON "course_resume_points"("user_id", "opened_at");

-- CreateIndex
CREATE UNIQUE INDEX "course_resume_points_user_id_course_id_key" ON "course_resume_points"("user_id", "course_id");

-- AddForeignKey
ALTER TABLE "course_resume_points" ADD CONSTRAINT "course_resume_points_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_resume_points" ADD CONSTRAINT "course_resume_points_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_resume_points" ADD CONSTRAINT "course_resume_points_course_material_id_fkey" FOREIGN KEY ("course_material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Start everyone where the old rule would have put them, so nobody's "continue" resets to
-- lesson one on the day this lands. The newest finished lesson in each course is the best
-- guess available until they next open something.
INSERT INTO "course_resume_points" ("id", "user_id", "course_id", "course_material_id", "opened_at")
SELECT gen_random_uuid(), p."user_id", p."course_id", p."course_material_id", p."completed_at"
FROM (
  SELECT DISTINCT ON ("user_id", "course_id")
         "user_id", "course_id", "course_material_id", "completed_at"
  FROM "course_progress"
  WHERE "course_material_id" IS NOT NULL
  ORDER BY "user_id", "course_id", "completed_at" DESC
) AS p
ON CONFLICT ("user_id", "course_id") DO NOTHING;
