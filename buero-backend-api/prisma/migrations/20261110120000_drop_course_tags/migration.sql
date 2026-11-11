-- Course tags, removed.
--
-- Nothing ever showed them to a student: no page rendered them, the one component that could
-- translate them had no callers, and the card only forwarded them into navigation state that
-- nothing read. The single job they really did - saying which half of the catalogue a course
-- belongs to - is now `is_integration`, a column that cannot be misspelled, and the earlier
-- migration carried every tagged course over to it.
--
-- This is the one destructive step: the tag values themselves go. Across the four courses they
-- were Beginner, Grammar, Vocabulary, Listening, Reading, Writing, Speaking, A1, A2, B1,
-- Language and Integration - every one of them either dead or a duplicate of a real column.
--
-- Run it only after 20261110090000_course_is_integration, which reads the tags.

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "tags";
