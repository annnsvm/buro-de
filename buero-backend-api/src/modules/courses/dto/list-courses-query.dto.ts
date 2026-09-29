import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { Language, Level } from "../../../generated/prisma/enums";

/** Фільтр публікації. Використовується в GET /courses/manage. */
export enum PublicationStatus {
  all = "all",
  published = "published",
  unpublished = "unpublished",
}

export class ListCoursesQueryDto {
  @ApiPropertyOptional({
    description: "Пошук по назві або опису курсу (OR, без урахування регістру)",
    example: "German",
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  search?: string;

  @ApiPropertyOptional({
    enum: Language,
    description: "Фільтр за мовою контенту",
  })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({
    example: "Language,Integration",
    description:
      "Фільтр за тегами (через кому). Курс має містити хоча б один із тегів.",
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({
    example: "Integration",
    description:
      "Виключити курси з цими тегами (через кому). Дозволяє описати категорію через те, " +
      "чим вона не є, і не залежати від того, чи розставлені теги вручну.",
  })
  @IsOptional()
  @IsString()
  tags_exclude?: string;

  @ApiPropertyOptional({
    enum: Level,
    description: "Фільтр за рівнем курсу (A1, A2, B1, B2)",
  })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  /** Тільки для GET /courses/manage: all | published | unpublished. За замовчуванням all. */
  @ApiPropertyOptional({
    enum: PublicationStatus,
    description:
      "Фільтр публікації (manage): all — усі, published — тільки опубліковані, unpublished — тільки неопубліковані",
  })
  @IsOptional()
  @IsEnum(PublicationStatus)
  publication_status?: PublicationStatus;
}
