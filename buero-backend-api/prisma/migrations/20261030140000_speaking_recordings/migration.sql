-- What a student recorded for a speaking task.
--
-- A new table only: nothing existing is read, altered or rewritten. Speaking is marked by the
-- student themselves, so no score is stored — only that the task was answered, which is what
-- the module test needs and what lets a student hear their own earlier attempt.

-- CreateTable
CREATE TABLE "speaking_recordings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "practice_element_id" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "duration_seconds" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speaking_recordings_pkey" PRIMARY KEY ("id")
);

-- One per task per student: re-recording replaces what was there rather than piling up.
-- CreateIndex
CREATE UNIQUE INDEX "speaking_recordings_user_id_practice_element_id_key" ON "speaking_recordings"("user_id", "practice_element_id");

-- AddForeignKey
ALTER TABLE "speaking_recordings" ADD CONSTRAINT "speaking_recordings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_recordings" ADD CONSTRAINT "speaking_recordings_practice_element_id_fkey" FOREIGN KEY ("practice_element_id") REFERENCES "practice_elements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
