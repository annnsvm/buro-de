-- How many modules from the start of a course a trial opens, per course.
--
-- The default is 2, which is the number the code used for every course before this column
-- existed, so every row that already exists keeps exactly the access it had. What changes is
-- that a short course can now be given a smaller number: two free modules out of nine is a
-- sample, two out of two was the whole course.
ALTER TABLE "courses" ADD COLUMN     "trial_module_count" INTEGER NOT NULL DEFAULT 2;
