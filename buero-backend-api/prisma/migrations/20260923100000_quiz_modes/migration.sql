-- CreateEnum
CREATE TYPE "QuizMode" AS ENUM ('practice', 'test');

-- AlterTable
ALTER TABLE "course_materials" ADD COLUMN     "passing_score" INTEGER,
ADD COLUMN     "quiz_mode" "QuizMode";


-- Existing quizzes are the checks that follow a lesson, so they keep marking each
-- answer as it is given. A module test is something the author marks as such.
UPDATE "course_materials" SET "quiz_mode" = 'practice' WHERE "type" = 'quiz';
