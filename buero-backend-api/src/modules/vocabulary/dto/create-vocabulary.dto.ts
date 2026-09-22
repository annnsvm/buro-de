import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { VocabularyCategory } from '../../../generated/prisma/enums';

export class CreateVocabularyDto {
  @ApiProperty({ example: 'Arbeit', description: 'Слово (унікальне у вашому словнику)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  word!: string;

  @ApiProperty({ example: 'робота', description: 'Переклад' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  translation!: string;

  @ApiPropertyOptional({
    enum: VocabularyCategory,
    default: VocabularyCategory.vocabulary,
    description: 'Категорія для фільтра у словнику',
  })
  @IsOptional()
  @IsEnum(VocabularyCategory)
  category?: VocabularyCategory;

  @ApiPropertyOptional({ example: 'Zur Arbeit gehen', description: 'Нотатка' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Курс, під час якого слово було додане' })
  @IsOptional()
  @IsUUID()
  course_id?: string;
}
