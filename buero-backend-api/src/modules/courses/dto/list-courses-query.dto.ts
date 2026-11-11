import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";
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

  /**
   * Which half of the catalogue to return.
   *
   * This replaced a pair of tag filters - `tags=Integration` and `tags_exclude=Integration` -
   * which needed the tag spelled exactly here and only loosely on the page, so the two
   * disagreed about any course whose tag was capitalised differently. Those filters are gone,
   * along with tags themselves.
   */
  @ApiPropertyOptional({
    type: Boolean,
    description:
      "true - тільки інтеграційні курси, false - тільки мовні. Без параметра - усі.",
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    /** Anything else stays as it came, so validation can reject it out loud. */
    return value;
  })
  @IsBoolean()
  integration?: boolean;

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
      "Фільтр публікації (manage): all - усі, published - тільки опубліковані, unpublished - тільки неопубліковані",
  })
  @IsOptional()
  @IsEnum(PublicationStatus)
  publication_status?: PublicationStatus;
}
