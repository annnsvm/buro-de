import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { QuestionType } from '../../generated/prisma/enums';

export class QuestionOptionDto {
  @ApiPropertyOptional({ description: 'Залишіть порожнім для нового варіанту' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ example: 'Warum?' })
  @IsString()
  @MaxLength(1000)
  text!: string;
}

export class SaveQuestionDto {
  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  type!: QuestionType;

  @ApiProperty({ example: 'Ich bleibe zu Hause, weil ich krank ___.' })
  @IsString()
  @MaxLength(2000)
  prompt!: string;

  @ApiProperty({
    type: [String],
    description:
      'Для вибору — id правильних варіантів (для кількох правильних — один рядок з id через кому). ' +
      'Для письмових — самі формулювання, кожне окремим рядком.',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  accepted_answers!: string[];

  @ApiPropertyOptional({ type: [QuestionOptionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  options?: QuestionOptionDto[];

  @ApiPropertyOptional({ type: [String], description: 'Слова для впорядкування' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tokens?: string[];

  @ApiPropertyOptional({ description: 'Показується студенту після відповіді' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  explanation?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @ApiPropertyOptional({ type: [String], example: ['weil'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}

export class ReorderQuestionsDto {
  @ApiProperty({ type: [String], description: 'Id питань у потрібному порядку' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids!: string[];
}
