import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CourseMaterialType, QuizMode } from '../../../generated/prisma/enums';

export class CreateCourseMaterialDto {
  @ApiProperty({
    enum: CourseMaterialType,
    example: 'video',
    description: 'Тип матеріалу: video | vocabulary | grammar | quiz | scenario | cultural_insight | homework | text',
  })
  @IsEnum(CourseMaterialType)
  type!: CourseMaterialType;

  @ApiProperty({ example: 'Lesson 1: Greetings', description: 'Назва матеріалу' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiProperty({
    description: 'Вміст: для video — JSON з youtube_video_id; для scenario — JSON з нодами/гілками; інші — текст або JSON',
    example: { youtube_video_id: 'dQw4w9WgXcQ' },
  })
  @IsNotEmpty()
  @IsObject()
  content!: Record<string, unknown>;

  @ApiPropertyOptional({
    enum: QuizMode,
    description:
      'Лише для type = quiz. practice — перевірка після уроку: кожна відповідь позначається одразу разом із поясненням. ' +
      'test — підсумковий тест модуля: перевірка цілком, а правильні відповіді показуються лише після успішної здачі.',
  })
  @IsOptional()
  @IsEnum(QuizMode)
  quiz_mode?: QuizMode;

  @ApiPropertyOptional({
    example: 60,
    description: 'Відсоток для зарахування тесту. Без нього тест неможливо провалити.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  passing_score?: number;

  @ApiProperty({ example: 0, description: 'Порядок у модулі (order_index)' })
  @IsInt()
  order_index!: number;
}
