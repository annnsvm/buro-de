-- Getting back in after forgetting the password.
--
-- Nothing but the emailed code lives here: its hash, when it expires, and how many wrong
-- guesses have been made. No user id and no name, so the table cannot be read as a list of
-- who forgot their password, and a row exists whether or not the address has an account -
-- which is what lets the request answer the same way either way.

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "password_resets_email_key" ON "password_resets"("email");
-- CreateIndex
CREATE INDEX "password_resets_expires_at_idx" ON "password_resets"("expires_at");
