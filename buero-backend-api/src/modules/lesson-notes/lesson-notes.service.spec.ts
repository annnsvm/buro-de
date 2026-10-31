import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "src/prisma/prisma.service";
import { LessonNotesService } from "./lesson-notes.service";

/**
 * Notes a student keeps on a lesson.
 *
 * The box they are typed into was never wired to anything: no state, no request, nothing stored.
 * So the first thing these tests pin down is that a note is actually written somewhere, and the
 * second is that it is written per student - a private note read by the wrong account would be
 * worse than one that is lost.
 */
describe("LessonNotesService", () => {
  let service: LessonNotesService;
  let prisma: {
    lessonNote: {
      findUnique: jest.Mock;
      upsert: jest.Mock;
      deleteMany: jest.Mock;
    };
    courseMaterial: { findUnique: jest.Mock };
  };

  const userId = "11111111-1111-1111-1111-111111111111";
  const otherUserId = "22222222-2222-2222-2222-222222222222";
  const materialId = "33333333-3333-3333-3333-333333333333";
  const updatedAt = new Date("2026-04-30T09:15:00.000Z");

  beforeEach(async () => {
    prisma = {
      lessonNote: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn(),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      courseMaterial: { findUnique: jest.fn().mockResolvedValue({ id: materialId }) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonNotesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(LessonNotesService);
  });

  describe("reading", () => {
    it("answers with an empty note for a lesson never written on", async () => {
      await expect(service.read(userId, materialId)).resolves.toEqual({
        text: "",
        updated_at: null,
      });
    });

    /**
     * Half a year later is the case this module exists for: the note is looked up by the pair
     * (student, lesson) and nothing else, so time away and a different machine change nothing.
     */
    it("gives back what was written, however long ago", async () => {
      prisma.lessonNote.findUnique.mockResolvedValue({
        text: "weil - дієслово в кінці",
        updatedAt,
      });

      await expect(service.read(userId, materialId)).resolves.toEqual({
        text: "weil - дієслово в кінці",
        updated_at: updatedAt.toISOString(),
      });
    });

    it("asks only for this student's note", async () => {
      await service.read(userId, materialId);

      expect(prisma.lessonNote.findUnique).toHaveBeenCalledWith({
        where: { userId_courseMaterialId: { userId, courseMaterialId: materialId } },
      });
    });
  });

  describe("saving", () => {
    beforeEach(() => {
      prisma.lessonNote.upsert.mockResolvedValue({ text: "нотатка", updatedAt });
    });

    it("stores the note against the student and the lesson", async () => {
      await service.save(userId, materialId, "нотатка");

      expect(prisma.lessonNote.upsert).toHaveBeenCalledWith({
        where: { userId_courseMaterialId: { userId, courseMaterialId: materialId } },
        create: { userId, courseMaterialId: materialId, text: "нотатка" },
        update: { text: "нотатка" },
      });
    });

    it("returns when it was saved, so the screen can say so", async () => {
      await expect(service.save(userId, materialId, "нотатка")).resolves.toEqual({
        text: "нотатка",
        updated_at: updatedAt.toISOString(),
      });
    });

    /** Editing replaces the one note rather than filing another: one row per lesson. */
    it("replaces the note instead of adding a second one", async () => {
      await service.save(userId, materialId, "спершу це");
      await service.save(userId, materialId, "потім це");

      expect(prisma.lessonNote.upsert).toHaveBeenCalledTimes(2);
      expect(prisma.lessonNote.upsert.mock.calls[1][0].update).toEqual({
        text: "потім це",
      });
    });

    /** Two students on the same lesson write two notes, never one shared one. */
    it("keeps two students' notes apart", async () => {
      await service.save(userId, materialId, "моя");
      await service.save(otherUserId, materialId, "не моя");

      const owners = prisma.lessonNote.upsert.mock.calls.map(
        (call) => call[0].where.userId_courseMaterialId.userId,
      );
      expect(owners).toEqual([userId, otherUserId]);
    });

    describe("an emptied box", () => {
      it("removes the note rather than storing a blank one", async () => {
        await expect(service.save(userId, materialId, "   \n  ")).resolves.toEqual({
          text: "",
          updated_at: null,
        });

        expect(prisma.lessonNote.upsert).not.toHaveBeenCalled();
        expect(prisma.lessonNote.deleteMany).toHaveBeenCalledWith({
          where: { userId, courseMaterialId: materialId },
        });
      });

      /** Clearing one student's note must not reach into anyone else's. */
      it("removes only this student's", async () => {
        await service.save(userId, materialId, "");

        expect(prisma.lessonNote.deleteMany.mock.calls[0][0].where).toEqual({
          userId,
          courseMaterialId: materialId,
        });
      });
    });

    /**
     * Without this the save fails on the foreign key, deep inside Prisma, and reaches the
     * student as a 500 that says nothing about which lesson is missing.
     */
    it("says the lesson is missing rather than failing on a constraint", async () => {
      prisma.courseMaterial.findUnique.mockResolvedValue(null);

      await expect(service.save(userId, materialId, "нотатка")).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.lessonNote.upsert).not.toHaveBeenCalled();
    });

    /** Whitespace is preserved inside the note: a list of lines is how people take notes. */
    it("keeps the shape of what was typed", async () => {
      const multiline = "1. weil\n2. dass\n\n   - перевірити Perfekt";
      prisma.lessonNote.upsert.mockResolvedValue({ text: multiline, updatedAt });

      await service.save(userId, materialId, multiline);

      expect(prisma.lessonNote.upsert.mock.calls[0][0].create.text).toBe(multiline);
    });
  });
});
