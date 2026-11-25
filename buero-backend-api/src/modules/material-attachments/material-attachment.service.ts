import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { AttachmentKind, Role } from "src/generated/prisma/enums";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CourseMaterialService } from "../course-materials/course-material.service";
import {
  CreateMaterialLinkAttachmentDto,
  UpdateMaterialAttachmentDto,
} from "./dto/material-attachment.dto";

type SerializedAttachment = {
  id: string;
  materialId: string;
  kind: AttachmentKind;
  title: string;
  url: string;
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MaterialAttachmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly courseMaterialService: CourseMaterialService,
  ) {}

  async assertCanAccess(
    userId: string,
    role: Role,
    courseId: string,
    moduleId: string,
  ): Promise<void> {
    await this.courseMaterialService.assertCanAccessModule(
      userId,
      role,
      courseId,
      moduleId,
    );
  }

  /**
   * Who is asking, which decides whether a draft exists.
   *
   * `findOne` hides an unpublished material from everyone but a teacher, and every method
   * here used to call it without saying who the viewer was - so it always answered as if a
   * student were asking. That was harmless while a new material was published the moment it
   * was created. Once creation started leaving it a draft, so that a half-written lesson
   * would not appear in front of students, it stopped being harmless: a teacher could not
   * list or add files on any lesson they had just made, because the lesson they were
   * looking at did not exist as far as this service was concerned.
   */
  async list(
    courseId: string,
    moduleId: string,
    materialId: string,
    viewerRole: Role,
  ): Promise<SerializedAttachment[]> {
    await this.courseMaterialService.findOne(
      courseId,
      moduleId,
      materialId,
      viewerRole,
    );
    const items = await this.prisma.materialAttachment.findMany({
      where: { materialId },
      orderBy: { orderIndex: "asc" },
    });
    return items.map((item) => this.serialize(item));
  }

  async createFile(
    courseId: string,
    moduleId: string,
    materialId: string,
    viewerRole: Role,
    file: Express.Multer.File,
    title?: string,
  ): Promise<SerializedAttachment> {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    await this.courseMaterialService.findOne(
      courseId,
      moduleId,
      materialId,
      viewerRole,
    );

    const publicId = randomUUID();
    const uploaded = await this.cloudinaryService.uploadFile(file.buffer, {
      folder: `materials/${materialId}`,
      publicId,
    });

    const nextOrderIndex = await this.nextOrderIndex(materialId);
    const attachment = await this.prisma.materialAttachment.create({
      data: {
        materialId,
        kind: AttachmentKind.file,
        title: (title?.trim() || file.originalname || "Attachment").slice(
          0,
          500,
        ),
        url: uploaded.url,
        fileName: file.originalname || null,
        mimeType: file.mimetype || null,
        sizeBytes: file.size ?? null,
        storageKey: `${uploaded.resourceType}:${uploaded.publicId}`,
        orderIndex: nextOrderIndex,
      },
    });
    return this.serialize(attachment);
  }

  async createLink(
    courseId: string,
    moduleId: string,
    materialId: string,
    viewerRole: Role,
    dto: CreateMaterialLinkAttachmentDto,
  ): Promise<SerializedAttachment> {
    await this.courseMaterialService.findOne(
      courseId,
      moduleId,
      materialId,
      viewerRole,
    );
    const nextOrderIndex = await this.nextOrderIndex(materialId);
    const attachment = await this.prisma.materialAttachment.create({
      data: {
        materialId,
        kind: AttachmentKind.link,
        title: dto.title.trim(),
        url: dto.url,
        orderIndex: nextOrderIndex,
      },
    });
    return this.serialize(attachment);
  }

  async update(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
    viewerRole: Role,
    dto: UpdateMaterialAttachmentDto,
  ): Promise<SerializedAttachment> {
    const existing = await this.findOwned(
      courseId,
      moduleId,
      materialId,
      attachmentId,
      viewerRole,
    );
    const attachment = await this.prisma.materialAttachment.update({
      where: { id: existing.id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
      },
    });
    return this.serialize(attachment);
  }

  async downloadFile(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
    viewerRole: Role,
  ): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
    const existing = await this.findOwned(
      courseId,
      moduleId,
      materialId,
      attachmentId,
      viewerRole,
    );
    if (existing.kind !== AttachmentKind.file) {
      throw new BadRequestException("This attachment is a link, not a file");
    }
    const buffer = await this.cloudinaryService.downloadStoredFile({
      storageKey: existing.storageKey,
      url: existing.url,
      fileName: existing.fileName,
      mimeType: existing.mimeType,
    });
    return {
      buffer,
      fileName: existing.fileName?.trim() || existing.title || "attachment",
      mimeType: existing.mimeType || "application/octet-stream",
    };
  }

  async delete(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
    viewerRole: Role,
  ): Promise<{ deleted: true; id: string }> {
    const existing = await this.findOwned(
      courseId,
      moduleId,
      materialId,
      attachmentId,
      viewerRole,
    );
    if (existing.storageKey) {
      const [resourceType, ...publicIdParts] = existing.storageKey.split(":");
      const publicId = publicIdParts.join(":");
      if (resourceType && publicId) {
        await this.cloudinaryService.destroyFile(publicId, resourceType);
      }
    }
    await this.prisma.materialAttachment.delete({ where: { id: existing.id } });
    return { deleted: true, id: existing.id };
  }

  private async findOwned(
    courseId: string,
    moduleId: string,
    materialId: string,
    attachmentId: string,
    viewerRole: Role,
  ) {
    await this.courseMaterialService.findOne(
      courseId,
      moduleId,
      materialId,
      viewerRole,
    );
    const attachment = await this.prisma.materialAttachment.findFirst({
      where: { id: attachmentId, materialId },
    });
    if (!attachment) {
      throw new NotFoundException(
        `Attachment ${attachmentId} was not found on this material`,
      );
    }
    return attachment;
  }

  private async nextOrderIndex(materialId: string): Promise<number> {
    const maxOrder = await this.prisma.materialAttachment.aggregate({
      where: { materialId },
      _max: { orderIndex: true },
    });
    return (maxOrder._max.orderIndex ?? -1) + 1;
  }

  private serialize(attachment: {
    id: string;
    materialId: string;
    kind: AttachmentKind;
    title: string;
    url: string;
    fileName: string | null;
    mimeType: string | null;
    sizeBytes: number | null;
    orderIndex: number;
    createdAt: Date;
    updatedAt: Date;
  }): SerializedAttachment {
    return {
      id: attachment.id,
      materialId: attachment.materialId,
      kind: attachment.kind,
      title: attachment.title,
      url: attachment.url,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      orderIndex: attachment.orderIndex,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt,
    };
  }
}
