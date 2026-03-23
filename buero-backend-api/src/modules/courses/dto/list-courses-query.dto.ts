import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { Language, Level } from "../../../generated/prisma/enums";

export class ListCoursesQueryDto {
  @ApiPropertyOptional({
    description:
      "Пошук по назві або опису курсу (OR, без урахування регістру)",
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
    enum: Level,
    description: "Фільтр за рівнем курсу (A1, A2, B1, B2)",
  })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;
}
