-- How long a student waits before retaking a module test they did not pass.
--
-- Attempts stay unlimited; this is the pause between them. With the answer key and the
-- explanations held back until a pass, a retake is honest work rather than copying, and a
-- few minutes is enough to make going back to the lesson the easy move instead of
-- resubmitting the same guesses. Ten is the default; zero turns the wait off.
ALTER TABLE "courses" ADD COLUMN     "test_retry_minutes" INTEGER NOT NULL DEFAULT 10;
