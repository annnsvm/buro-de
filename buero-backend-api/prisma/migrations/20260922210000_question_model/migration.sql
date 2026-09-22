-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('single_choice', 'multi_choice', 'fill_blank', 'text_input', 'ordering');

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "material_id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'single_choice',
    "prompt" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "accepted_answers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "explanation" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "quiz_attempt_id" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "raw_answer" JSONB NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questions_material_id_order_index_idx" ON "questions"("material_id", "order_index");

-- CreateIndex
CREATE INDEX "question_attempts_user_id_question_id_idx" ON "question_attempts"("user_id", "question_id");

-- CreateIndex
CREATE INDEX "question_attempts_user_id_answered_at_idx" ON "question_attempts"("user_id", "answered_at");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "course_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_attempts" ADD CONSTRAINT "question_attempts_quiz_attempt_id_fkey" FOREIGN KEY ("quiz_attempt_id") REFERENCES "quiz_attempts"("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- Backfill: move the questions that already live inside course_materials.content
-- into the new table. The row keeps the id the question had in that JSON, so answers
-- submitted by the browser and stored in quiz_attempts.answers_snapshot still match.
--
-- `correct` as a string means one option; as an array it means a set of options, which
-- is stored as one accepted answer: the ids sorted and comma-joined, the same shape the
-- grader compares against.
INSERT INTO "questions" (
  "id", "material_id", "type", "prompt", "payload",
  "accepted_answers", "order_index", "created_at", "updated_at"
)
SELECT
  COALESCE(NULLIF(q.value ->> 'id', ''), gen_random_uuid()::text),
  m."id",
  CASE
    WHEN jsonb_typeof(q.value -> 'correct') = 'array' THEN 'multi_choice'
    ELSE 'single_choice'
  END::"QuestionType",
  COALESCE(q.value ->> 'text', ''),
  jsonb_build_object('options', COALESCE(q.value -> 'options', '[]'::jsonb)),
  CASE
    WHEN jsonb_typeof(q.value -> 'correct') = 'array' THEN ARRAY[(
      SELECT string_agg(item, ',' ORDER BY item)
      FROM jsonb_array_elements_text(q.value -> 'correct') AS t(item)
    )]
    WHEN q.value ->> 'correct' IS NULL THEN ARRAY[]::text[]
    ELSE ARRAY[q.value ->> 'correct']
  END,
  (q.ordinality - 1)::int,
  now(),
  now()
FROM "course_materials" m
CROSS JOIN LATERAL jsonb_array_elements(m."content" -> 'questions')
  WITH ORDINALITY AS q(value, ordinality)
WHERE m."type" = 'quiz'
  AND jsonb_typeof(m."content" -> 'questions') = 'array'
ON CONFLICT ("id") DO NOTHING;
