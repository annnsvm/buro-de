import * as dotenv from "dotenv";
import * as path from "path";

// Turn on e2e mode first (AppModule skips the throttler), then load .env.
process.env.E2E_TEST = "true";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

process.env.E2E_TEST = "true";

/**
 * End-to-end tests create, change and delete rows. Pointed at the deployed database
 * they would damage real accounts, payments and course progress, so they run against
 * DATABASE_URL_TEST and never against DATABASE_URL.
 */
const testDatabaseUrl = process.env.DATABASE_URL_TEST;

if (!testDatabaseUrl) {
  throw new Error(
    [
      "DATABASE_URL_TEST is not set, so the end-to-end tests have nowhere safe to run.",
      "",
      "Start the local database and point the tests at it:",
      "  docker compose up -d",
      '  DATABASE_URL_TEST="postgresql://buero:buero@localhost:5433/buero_test?schema=public"',
      "",
      "Add that line to buero-backend-api/.env. Never set it to the deployed database.",
    ].join("\n"),
  );
}

/**
 * A second guard for the case where the two variables were copied over each other:
 * the test database has to be a different database from the development one.
 */
if (testDatabaseUrl === process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL_TEST is the same as DATABASE_URL. The end-to-end tests would " +
      "erase your working data. Point DATABASE_URL_TEST at a separate database.",
  );
}

// Everything downstream — Prisma included — reads DATABASE_URL.
process.env.DATABASE_URL = testDatabaseUrl;
