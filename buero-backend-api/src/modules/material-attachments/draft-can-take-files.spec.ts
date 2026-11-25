import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import {
  AttachmentKind,
  CourseMaterialType,
  Role,
} from "../../generated/prisma/enums";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import { MaterialAttachmentService } from "./material-attachment.service";

/**
 * A lesson that has not been published yet can still be given its files.
 *
 * The regression this guards, in the order it happened. Drafts were introduced so that a
 * half-written lesson would not appear in front of students, and hiding them was done by
 * filtering the read - `findOne` returns nothing when `published_at` is null and the
 * viewer is not a teacher. Every method in the attachment service called that same
 * `findOne` and never said who was asking, so it was always answered as if a student had
 * asked.
 *
 * While new material was published the moment it was created, nothing showed. The day
 * creation started leaving a draft behind, attaching a file to a lesson just made became
 * impossible: the editor answered "Матеріал з id ... не знайдено або не належить модулю"
 * for a lesson the author was looking at, and then "Request failed with status code 404"
 * when she tried to save the file anyway.
 *
 * `draft-is-editable.spec.ts` guards the same thing for renaming and deleting. This is the
 * third door into the same room, and it was missed.
 */
const COURSE = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const MODULE = "mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm";
const DRAFT = "e62a7d65-fb95-417b-8572-87057d888955";
const ATTACHMENT = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

const draftRow = {
  id: DRAFT,
  moduleId: MODULE,
  type: CourseMaterialType.video,
  title: "1.1 Як пройшли вихідні",
  content: {},
  publishedAt: null,
  attachments: [],
};

const attachmentRow = {
  id: ATTACHMENT,
  materialId: DRAFT,
  kind: AttachmentKind.file,
  title: "Buro_de-A2.1-1.1-Shpargalka.pdf",
  url: "https://cdn.example/x.pdf",
  fileName: "Buro_de-A2.1-1.1-Shpargalka.pdf",
  mimeType: "application/pdf",
  sizeBytes: 641024,
  storageKey: "raw:materials/x",
  orderIndex: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("files on a lesson that is still a draft", () => {
  let service: MaterialAttachmentService;
  let prisma: {
    courseModule: { findFirst: jest.Mock };
    courseMaterial: { findFirst: jest.Mock };
    materialAttachment: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      aggregate: jest.Mock;
    };
  };
  let cloudinary: {
    uploadFile: jest.Mock;
    downloadStoredFile: jest.Mock;
    destroyFile: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      courseModule: { findFirst: jest.fn().mockResolvedValue({ id: MODULE }) },
      courseMaterial: {
        /**
         * Stands in for the database rather than for the answer: the row is a draft, so a
         * query that asks for `published_at is not null` finds nothing, exactly as Postgres
         * would. Returning the row regardless would let the bug through the test.
         */
        findFirst: jest.fn().mockImplementation((args: { where?: Record<string, unknown> }) => {
          const asksForPublished = args?.where?.publishedAt !== undefined;
          return Promise.resolve(asksForPublished ? null : draftRow);
        }),
      },
      materialAttachment: {
        findMany: jest.fn().mockResolvedValue([attachmentRow]),
        findFirst: jest.fn().mockResolvedValue(attachmentRow),
        create: jest.fn().mockResolvedValue(attachmentRow),
        update: jest.fn().mockResolvedValue(attachmentRow),
        delete: jest.fn().mockResolvedValue(attachmentRow),
        aggregate: jest.fn().mockResolvedValue({ _max: { orderIndex: null } }),
      },
    };
    cloudinary = {
      uploadFile: jest
        .fn()
        .mockResolvedValue({ url: "https://cdn.example/x.pdf", publicId: "x", resourceType: "raw" }),
      downloadStoredFile: jest.fn().mockResolvedValue(Buffer.from("pdf")),
      destroyFile: jest.fn().mockResolvedValue(undefined),
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialAttachmentService,
        CourseMaterialService,
        { provide: PrismaService, useValue: prisma as unknown as PrismaService },
        {
          provide: CloudinaryService,
          useValue: cloudinary as unknown as CloudinaryService,
        },
      ],
    }).compile();
    service = mod.get(MaterialAttachmentService);
  });

  const pdf = {
    buffer: Buffer.from("pdf"),
    originalname: "Buro_de-A2.1-1.1-Shpargalka.pdf",
    mimetype: "application/pdf",
    size: 641024,
  } as unknown as Express.Multer.File;

  describe("for the teacher writing it", () => {
    /** The first error on her screen: the list failed before she had done anything. */
    it("lists them", async () => {
      await expect(
        service.list(COURSE, MODULE, DRAFT, Role.teacher),
      ).resolves.toHaveLength(1);
    });

    /** The second error: the file was staged, and saving it answered 404. */
    it("takes an uploaded file", async () => {
      await expect(
        service.createFile(COURSE, MODULE, DRAFT, Role.teacher, pdf),
      ).resolves.toMatchObject({ id: ATTACHMENT });
      expect(prisma.materialAttachment.create).toHaveBeenCalled();
    });

    it("takes a link", async () => {
      await expect(
        service.createLink(COURSE, MODULE, DRAFT, Role.teacher, {
          title: "Додаткове читання",
          url: "https://example.com",
        }),
      ).resolves.toBeDefined();
    });

    it("renames one", async () => {
      await expect(
        service.update(COURSE, MODULE, DRAFT, ATTACHMENT, Role.teacher, {
          title: "Шпаргалка",
        }),
      ).resolves.toBeDefined();
    });

    it("deletes one", async () => {
      await expect(
        service.delete(COURSE, MODULE, DRAFT, ATTACHMENT, Role.teacher),
      ).resolves.toMatchObject({ deleted: true });
    });

    it("downloads one", async () => {
      await expect(
        service.downloadFile(COURSE, MODULE, DRAFT, ATTACHMENT, Role.teacher),
      ).resolves.toMatchObject({ mimeType: "application/pdf" });
    });

    /**
     * Asserted on the query rather than only on the outcome. A filter that happened to
     * match today would put the bug back the first time a draft was involved, and the
     * outcome alone cannot tell the two apart.
     */
    it("is never asked whether students may see the lesson", async () => {
      await service.list(COURSE, MODULE, DRAFT, Role.teacher);
      await service.createFile(COURSE, MODULE, DRAFT, Role.teacher, pdf);
      await service.delete(COURSE, MODULE, DRAFT, ATTACHMENT, Role.teacher);

      const lookups = prisma.courseMaterial.findFirst.mock.calls.map(
        (call) => call[0].where as Record<string, unknown>,
      );
      expect(lookups.length).toBeGreaterThanOrEqual(3);
      for (const where of lookups) {
        expect(where).not.toHaveProperty("publishedAt");
      }
    });
  });

  /**
   * And the reason the filter exists in the first place. A draft is the teacher's alone,
   * so its files are too - a handout for a lesson still being written must not be reachable
   * by guessing at a URL.
   */
  describe("for a student", () => {
    it("does not exist", async () => {
      await expect(
        service.list(COURSE, MODULE, DRAFT, Role.student),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("cannot be downloaded", async () => {
      await expect(
        service.downloadFile(COURSE, MODULE, DRAFT, ATTACHMENT, Role.student),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("is refused by asking about publication", async () => {
      await service.list(COURSE, MODULE, DRAFT, Role.student).catch(() => undefined);

      expect(prisma.courseMaterial.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ publishedAt: { not: null } }),
        }),
      );
    });
  });
});
