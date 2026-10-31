import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {
  CourseMaterialType,
  PracticeBlock,
  PracticeElementKind,
  QuestionType,
} from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
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
      count: jest.Mock;
    };
    practiceElement: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      aggregate: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let cloudinary: { uploadFile: jest.Mock };

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
        count: jest.fn().mockResolvedValue(0),
      },
      practiceElement: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue({ id: "el-1" }),
        create: jest.fn((args: { data: unknown }) => args.data),
        update: jest.fn((args: { data: unknown }) => args.data),
        delete: jest.fn(),
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: null } }),
      },
      $transaction: jest.fn((operations: unknown[]) => Promise.all(operations)),
    };
    cloudinary = { uploadFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionEditorService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: CloudinaryService,
          useValue: cloudinary as unknown as CloudinaryService,
        },
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
  /**
   * Adding a reading text by hand, rather than through a CSV import.
   *
   * A text is what makes Lesen a reading task instead of a set of questions about nothing,
   * so what matters here is that a question cannot end up pointing at a text the student
   * will never be shown.
   */
  describe("the text a block's questions are about", () => {
    const textDto = () => ({
      block: PracticeBlock.lesen,
      kind: PracticeElementKind.text,
      title: "  Eine E-Mail aus dem Büro  ",
      body: "  Hallo Anna,  ",
    });

    it("adds it as the first text of its block", async () => {
      await service.saveElement(courseId, moduleId, materialId, null, textDto());
      expect(prisma.practiceElement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          materialId,
          block: PracticeBlock.lesen,
          title: "Eine E-Mail aus dem Büro",
          body: "Hallo Anna,",
          orderIndex: 0,
        }),
      });
    });

    it("counts the position within the block, not the whole material", async () => {
      prisma.practiceElement.aggregate.mockResolvedValue({
        _max: { orderIndex: 1 },
      });
      await service.saveElement(courseId, moduleId, materialId, null, textDto());
      expect(prisma.practiceElement.aggregate).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { materialId, block: PracticeBlock.lesen },
        }),
      );
      expect(prisma.practiceElement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ orderIndex: 2 }),
      });
    });

    it("binds a question to a text of the same block", async () => {
      await service.save(courseId, moduleId, materialId, null, {
        ...choiceDto(),
        block: PracticeBlock.lesen,
        element_id: "el-1",
      });
      expect(prisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          block: PracticeBlock.lesen,
          elementId: "el-1",
        }),
      });
    });

    /**
     * Without this the question would be saved with the link quietly dropped, and the
     * teacher would only find out when a student met a question about nothing.
     */
    it("refuses a text that belongs to another block", async () => {
      prisma.practiceElement.findFirst.mockResolvedValue(null);
      await expect(
        service.save(courseId, moduleId, materialId, null, {
          ...choiceDto(),
          block: PracticeBlock.lesen,
          element_id: "el-from-hoeren",
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.question.create).not.toHaveBeenCalled();
    });

    it("puts a question with no block into Grammatik", async () => {
      await service.save(courseId, moduleId, materialId, null, choiceDto());
      expect(prisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          block: PracticeBlock.grammatik,
          elementId: null,
        }),
      });
    });

    /** Losing the questions with the text would turn a mistyped title into lost work. */
    it("keeps the questions when the text is deleted", async () => {
      prisma.practiceElement.findFirst.mockResolvedValue({ id: "el-1" });
      prisma.question.count.mockResolvedValue(3);
      const result = await service.removeElement(
        courseId,
        moduleId,
        materialId,
        "el-1",
      );
      expect(prisma.practiceElement.delete).toHaveBeenCalledWith({
        where: { id: "el-1" },
      });
      expect(prisma.question.delete).not.toHaveBeenCalled();
      expect(result).toEqual({
        deleted: true,
        id: "el-1",
        unbound_questions: 3,
      });
    });

    /** So the author can see, on the page, that a text nobody asks about is invisible. */
    it("says how many questions are about each text", async () => {
      prisma.practiceElement.findMany.mockResolvedValue([
        { id: "el-1", block: PracticeBlock.lesen, kind: "text", title: "T", body: "B",
          audioUrl: null, transcript: null, sampleAnswer: null, hints: null,
          orderIndex: 0, _count: { questions: 4 } },
        { id: "el-2", block: PracticeBlock.lesen, kind: "text", title: "U", body: "B",
          audioUrl: null, transcript: null, sampleAnswer: null, hints: null,
          orderIndex: 1, _count: { questions: 0 } },
      ]);
      const listed = await service.listElements(courseId, moduleId, materialId);
      expect(listed.map((element) => element.question_count)).toEqual([4, 0]);
    });

    it("refuses to touch a text of another material", async () => {
      prisma.practiceElement.findFirst.mockResolvedValue(null);
      await expect(
        service.removeElement(courseId, moduleId, materialId, "elsewhere"),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
  /**
   * Attaching a module's recordings in one go.
   *
   * The CSV already named the file each element wants, so the match is by name. Sixteen trips
   * through a file dialog is sixteen chances to put a recording under the wrong question, and
   * the author would only find out by listening to all of them.
   */
  describe("uploading a block's recordings together", () => {
    const file = (originalname: string) =>
      ({ originalname, buffer: Buffer.from("x") }) as Express.Multer.File;

    beforeEach(() => {
      prisma.practiceElement.findMany.mockResolvedValue([
        { id: "a1", audioFileName: "A2.1-2.1-hoeren-1.mp3", audioUrl: null },
        { id: "a2", audioFileName: "A2.1-2.1-hoeren-2.mp3", audioUrl: null },
      ]);
      cloudinary.uploadFile.mockResolvedValue({
        url: "https://res.cloudinary.com/x/a.mp3",
        publicId: "p",
        resourceType: "video",
      });
    });

    it("puts each file behind the element that asked for it", async () => {
      const result = await service.attachAudioBatch(courseId, moduleId, materialId, [
        file("A2.1-2.1-hoeren-2.mp3"),
        file("A2.1-2.1-hoeren-1.mp3"),
      ]);

      expect(result.uploaded).toBe(2);
      expect(result.unmatched).toEqual([]);
      expect(result.still_missing).toEqual([]);
      expect(prisma.practiceElement.update).toHaveBeenCalledTimes(2);
    });

    /** Case and stray spaces in a file name are the author's, not a reason to refuse the file. */
    it("matches regardless of case", async () => {
      const result = await service.attachAudioBatch(courseId, moduleId, materialId, [
        file("  a2.1-2.1-HOEREN-1.MP3  "),
      ]);
      expect(result.matched).toEqual(["A2.1-2.1-hoeren-1.mp3"]);
    });

    /** Usually a typo in one of the two names - invisible unless it is said out loud. */
    it("names a file nobody asked for instead of dropping it", async () => {
      const result = await service.attachAudioBatch(courseId, moduleId, materialId, [
        file("hoeren-3.mp3"),
      ]);
      expect(result.unmatched).toEqual(["hoeren-3.mp3"]);
      expect(result.uploaded).toBe(0);
      expect(cloudinary.uploadFile).not.toHaveBeenCalled();
    });

    it("says which recordings are still owed", async () => {
      const result = await service.attachAudioBatch(courseId, moduleId, materialId, [
        file("A2.1-2.1-hoeren-1.mp3"),
      ]);
      expect(result.still_missing).toEqual(["A2.1-2.1-hoeren-2.mp3"]);
    });

    it("refuses an empty upload rather than reporting success", async () => {
      await expect(
        service.attachAudioBatch(courseId, moduleId, materialId, []),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
