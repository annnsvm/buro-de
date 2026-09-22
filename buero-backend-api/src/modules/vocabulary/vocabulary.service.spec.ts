import { ConflictException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Prisma } from "src/generated/prisma/client";
import { VocabularyCategory } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { VocabularyService } from "./vocabulary.service";

describe("VocabularyService", () => {
  let service: VocabularyService;
  let prisma: {
    userVocabularyEntry: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const userId = "11111111-1111-1111-1111-111111111111";
  const otherUserId = "22222222-2222-2222-2222-222222222222";
  const entryId = "33333333-3333-3333-3333-333333333333";

  const uniqueViolation = () =>
    new Prisma.PrismaClientKnownRequestError("unique", {
      code: "P2002",
      clientVersion: "7.5.0",
    });

  beforeEach(async () => {
    prisma = {
      userVocabularyEntry: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VocabularyService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(VocabularyService);
  });

  describe("findAllForUser", () => {
    it("never reads outside the caller's own words", async () => {
      await service.findAllForUser(userId);

      expect(prisma.userVocabularyEntry.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId }),
        }),
      );
    });

    it("keeps the owner filter when searching", async () => {
      await service.findAllForUser(userId, "  Arbeit  ");

      const where = prisma.userVocabularyEntry.findMany.mock.calls[0][0].where;
      expect(where.userId).toBe(userId);
      expect(where.OR).toEqual([
        { word: { contains: "Arbeit", mode: "insensitive" } },
        { translation: { contains: "Arbeit", mode: "insensitive" } },
      ]);
    });

    it("does not add a search filter for blank input", async () => {
      await service.findAllForUser(userId, "   ");

      expect(prisma.userVocabularyEntry.findMany.mock.calls[0][0].where.OR).toBeUndefined();
    });
  });

  describe("create", () => {
    it("stamps the entry with the caller's id", async () => {
      prisma.userVocabularyEntry.create.mockResolvedValue({ id: entryId });

      await service.create(userId, { word: " Arbeit ", translation: " робота " });

      expect(prisma.userVocabularyEntry.create).toHaveBeenCalledWith({
        data: { userId, word: "Arbeit", translation: "робота" },
      });
    });

    it("stores the category and owning course when given", async () => {
      prisma.userVocabularyEntry.create.mockResolvedValue({ id: entryId });

      await service.create(userId, {
        word: "damit",
        translation: "щоб",
        category: VocabularyCategory.grammar,
        course_id: "44444444-4444-4444-4444-444444444444",
      });

      expect(prisma.userVocabularyEntry.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          category: VocabularyCategory.grammar,
          courseId: "44444444-4444-4444-4444-444444444444",
        }),
      });
    });

    it("reports a duplicate inside one user's own list", async () => {
      prisma.userVocabularyEntry.create.mockRejectedValue(uniqueViolation());

      await expect(
        service.create(userId, { word: "Arbeit", translation: "робота" }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("ownership", () => {
    /**
     * The uniqueness rule is per user, so two students saving the same word must not
     * collide, and neither may touch the other's entry.
     */
    it("hides another user's entry behind a 404 on update", async () => {
      prisma.userVocabularyEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.update(otherUserId, entryId, { translation: "hacked" }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.userVocabularyEntry.update).not.toHaveBeenCalled();
    });

    it("hides another user's entry behind a 404 on delete", async () => {
      prisma.userVocabularyEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.delete(otherUserId, entryId),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.userVocabularyEntry.delete).not.toHaveBeenCalled();
    });

    it("looks entries up by id and owner together", async () => {
      prisma.userVocabularyEntry.findFirst.mockResolvedValue({ id: entryId });
      prisma.userVocabularyEntry.delete.mockResolvedValue({});

      await service.delete(userId, entryId);

      expect(prisma.userVocabularyEntry.findFirst).toHaveBeenCalledWith({
        where: { id: entryId, userId },
      });
    });

    it("deletes the caller's own entry", async () => {
      prisma.userVocabularyEntry.findFirst.mockResolvedValue({ id: entryId });
      prisma.userVocabularyEntry.delete.mockResolvedValue({});

      await expect(service.delete(userId, entryId)).resolves.toEqual({
        deleted: true,
        id: entryId,
      });
    });
  });
});
