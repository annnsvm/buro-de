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
import {
  PracticeBlock,
  PracticeElementKind,
  QuestionType,
} from '../../generated/prisma/enums';

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
      'Для вибору - id правильних варіантів (для кількох правильних - один рядок з id через кому). ' +
      'Для письмових - самі формулювання, кожне окремим рядком.',
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

  @ApiPropertyOptional({
    enum: PracticeBlock,
    description: 'Блок практики. Для квізу й тесту не вказується.',
  })
  @IsOptional()
  @IsEnum(PracticeBlock)
  block?: PracticeBlock;

  @ApiPropertyOptional({
    description: 'Id тексту або аудіо, до якого це питання. Порожнє - питання саме по собі.',
  })
  @IsOptional()
  @IsString()
  element_id?: string;
}

/**
 * A text to read, a recording to listen to, or a prompt to speak from.
 *
 * Kept apart from the question because several questions share one, and because the student
 * sees it for as long as they answer them rather than once per question.
 */
export class SavePracticeElementDto {
  @ApiProperty({ enum: PracticeBlock })
  @IsEnum(PracticeBlock)
  block!: PracticeBlock;

  @ApiProperty({ enum: PracticeElementKind })
  @IsEnum(PracticeElementKind)
  kind!: PracticeElementKind;

  @ApiPropertyOptional({
    description:
      'Коротка назва - для списків і заголовків, не саме завдання. Якщо не вказана, ' +
      'береться перше речення завдання.',
    example: 'Eine E-Mail aus dem Büro',
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  title?: string;

  @ApiPropertyOptional({
    description:
      'Саме завдання або текст: для читання - текст, для письма й говоріння - умова. ' +
      'Для аудіо порожнє.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  body?: string;

  @ApiPropertyOptional({ description: 'Відкривається після всіх відповідей про це аудіо' })
  @IsOptional()
  @IsString()
  @MaxLength(20000)
  transcript?: string;

  @ApiPropertyOptional({ description: 'Зразкова відповідь для усного завдання' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  sample_answer?: string;

  @ApiPropertyOptional({ description: 'Слова-опори' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  hints?: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Критерії оцінювання листа - по одному рядку, у порядку автора. Студент бачить їх до ' +
      'того, як почне писати, перевірка оцінює саме за ними, і результат цитує їх назад.',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(1000, { each: true })
  criteria?: string[];

  @ApiPropertyOptional({
    description: 'Скільки речень має бути в тілі листа - від. Рахується, а не оцінюється.',
    example: 6,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  min_sentences?: number;

  @ApiPropertyOptional({ description: 'Скільки речень має бути - до.', example: 8 })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_sentences?: number;
}

export class ReorderQuestionsDto {
  @ApiProperty({ type: [String], description: 'Id питань у потрібному порядку' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids!: string[];
}
