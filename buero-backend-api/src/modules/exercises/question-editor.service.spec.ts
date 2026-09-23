import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CourseMaterialType, QuestionType } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { QuestionEditorService } from "./question-editor.service";

describe("QuestionEditorService", () => {
  let service: QuestionEditorService;
  let prisma: {
    courseMaterial: { findFirst: jest.Mock };
    question: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      aggregate: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const courseId = "course-1";
  const moduleId = "module-1";
  const materialId = "material-1";

  const options = [
    { id: "a", text: "Wohin?" },
    { id: "b", text: "Warum?" },
  ];

  beforeEach(async () => {
    prisma = {
      courseMaterial: {
        findFirst: jest.fn().mockResolvedValue({
          id: materialId,
          type: CourseMaterialType.quiz,
        }),
      },
      question: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        create: jest.fn((args: { data: unknown }) => args.data),
        update: jest.fn((args: { data: unknown }) => args.data),
        delete: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: 2 } }),
      },
      $transaction: jest.fn((operations: unknown[]) => Promise.all(operations)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionEditorService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
      ],
    }).compile();

    service = module.get(QuestionEditorService);
  });

  const choiceDto = () => ({
    type: QuestionType.single_choice,
    prompt: "  На яке питання відповідає weil?  ",
    accepted_answers: ["b"],
    options,
  });

  describe("creating a question", () => {
    it("adds it after the last one", async () => {
      await service.save(courseId, moduleId, materialId, null, choiceDto());
      expect(prisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ orderIndex: 3, materialId }),
      });
    });

    it("trims the prompt", async () => {
      const saved = await service.save(
        courseId,
        moduleId,
        materialId,
        null,
        choiceDto(),
      );
      expect(saved.prompt).toBe("На яке питання відповідає weil?");
    });

    it("gives a new option an id of its own", async () => {
      const saved = await service.save(courseId, moduleId, materialId, null, {
        ...choiceDto(),
        options: [{ text: "Wohin?" }, { id: "b", text: "Warum?" }],
      });
      expect(saved.options[0].id).toBeTruthy();
      expect(saved.options[1].id).toBe("b");
    });
  });

  describe("refusing a question a student could not answer", () => {
    it("rejects an answer key pointing at an option that is not there", async () => {
      await expect(
        service.save(courseId, moduleId, materialId, null, {
          ...choiceDto(),
          accepted_answers: ["zz"],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.question.create).not.toHaveBeenCalled();
    });

    it("rejects a choice question with a single option", async () => {
      await expect(
        service.save(courseId, moduleId, materialId, null, {
          ...choiceDto(),
          options: [{ id: "a", text: "Wohin?" }],
          accepted_answers: ["a"],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("rejects a written question with a blank answer", async () => {
      await expect(
        service.save(courseId, moduleId, materialId, null, {
          type: QuestionType.fill_blank,
          prompt: "Ich ___ müde.",
          accepted_answers: ["   "],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("rejects an ordering question with nothing to arrange", async () => {
      await expect(
        service.save(courseId, moduleId, materialId, null, {
          type: QuestionType.ordering,
          prompt: "Складіть речення",
          accepted_answers: ["Ich lerne"],
          tokens: ["Ich"],
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe("payload follows the type", () => {
    it("keeps no options on a written question", async () => {
      const saved = await service.save(courseId, moduleId, materialId, null, {
        type: QuestionType.text_input,
        prompt: "Перекладіть",
        accepted_answers: ["Ich bin müde."],
        options,
      });
      expect(saved.options).toEqual([]);
    });

    it("keeps the words of an ordering question", async () => {
      const saved = await service.save(courseId, moduleId, materialId, null, {
        type: QuestionType.ordering,
        prompt: "Складіть речення",
        accepted_answers: ["Ich lerne Deutsch"],
        tokens: [" Ich ", "lerne", "Deutsch"],
      });
      expect(saved.tokens).toEqual(["Ich", "lerne", "Deutsch"]);
    });
  });

  describe("guards", () => {
    it("refuses a material that is not a quiz", async () => {
      prisma.courseMaterial.findFirst.mockResolvedValue({
        id: materialId,
        type: CourseMaterialType.video,
      });
      await expect(
        service.list(courseId, moduleId, materialId),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("refuses a material of another module", async () => {
      prisma.courseMaterial.findFirst.mockResolvedValue(null);
      await expect(
        service.list(courseId, moduleId, materialId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("refuses to edit a question of another quiz", async () => {
      prisma.question.findFirst.mockResolvedValue(null);
      await expect(
        service.save(courseId, moduleId, materialId, "other", choiceDto()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("refuses to reorder using ids from elsewhere", async () => {
      prisma.question.findMany.mockResolvedValue([{ id: "q1" }]);
      await expect(
        service.reorder(courseId, moduleId, materialId, { ids: ["q1", "q2"] }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe("reordering", () => {
    it("writes the position of each question", async () => {
      prisma.question.findMany.mockResolvedValue([{ id: "q1" }, { id: "q2" }]);
      await service.reorder(courseId, moduleId, materialId, {
        ids: ["q2", "q1"],
      });
      expect(prisma.question.update).toHaveBeenCalledWith({
        where: { id: "q2" },
        data: { orderIndex: 0 },
      });
      expect(prisma.question.update).toHaveBeenCalledWith({
        where: { id: "q1" },
        data: { orderIndex: 1 },
      });
    });
  });
});
