-- Which block of a practice a sitting belongs to.
--
-- Nullable, and left null on every existing row: a quiz and a module test are answered
-- whole and have no block, and an attempt made before practices had blocks is read the
-- same way it always was. Nothing moves.
ALTER TABLE "quiz_attempts" ADD COLUMN "block" "PracticeBlock";
