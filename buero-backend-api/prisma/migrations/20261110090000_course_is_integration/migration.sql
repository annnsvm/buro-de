-- Which half of the catalogue a course belongs to, as a column rather than a tag.
--
-- It used to be read off an "Integration" tag. That made a split the students see depend on a
-- teacher typing a word, and worse, on its capitals: the server matched the tag exactly
-- (Prisma `hasSome`) while the page matched it loosely (lowercased `includes`), so "integration"
-- put a course in the integration section of the page and left it out of the server's filter.
--
-- Additive and reversible: the tags stay exactly where they are, and the backfill reads them, so
-- nothing has to be re-tagged and this can be dropped again without losing anything.

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "is_integration" BOOLEAN NOT NULL DEFAULT false;

-- Carry over every course already tagged for integration, however it was capitalised, so the
-- catalogue looks the same the moment this lands.
UPDATE "courses"
SET "is_integration" = true
WHERE EXISTS (
  SELECT 1
  FROM unnest("tags") AS tag
  WHERE lower(tag) LIKE '%integration%'
);
