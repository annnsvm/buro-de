import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Language, Level } from '../../../generated/prisma/enums';

export class CreateCourseDto {
  @ApiProperty({ example: 'German A1 Basics', description: 'Назва курсу' })
  @IsString()
  @MaxLength(500)
  title!: string;

  @ApiPropertyOptional({ example: 'Introduction to German language.', description: 'Опис курсу' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Language, example: 'en', description: 'Мова контенту курсу' })
  @IsEnum(Language)
  language!: Language;

  @ApiPropertyOptional({ default: false, description: 'Чи опублікований курс' })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @ApiPropertyOptional({ example: 29.99, description: 'Ціна курсу (наприклад у євро)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    default: false,
    description:
      'Чи це інтеграційний курс. Саме це поле розділяє каталог на "мова" та "інтеграція" ' +
      'і визначає вкладку в "Моєму навчанні". Раніше роль грав тег Integration, через що ' +
      'поділ залежав від того, як учитель напише слово.',
  })
  @IsOptional()
  @IsBoolean()
  is_integration?: boolean;

  @ApiPropertyOptional({
    enum: Level,
    example: 'A1',
    description: 'Рівень, з якого починається курс',
  })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiPropertyOptional({
    enum: Level,
    example: 'B1',
    description:
      'Найвищий рівень, якого досягає курс, якщо він охоплює кілька. ' +
      'Без нього курс стоїть лише на level. Каталог показує курс під кожним рівнем діапазону.',
  })
  @IsOptional()
  @IsEnum(Level)
  level_to?: Level;

  @ApiPropertyOptional({ example: 12, description: 'Тривалість курсу в годинах' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  duration_hours?: number;

  @ApiPropertyOptional({
    example: 2,
    default: 2,
    description:
      'Скільки модулів з початку курсу відкриває пробний доступ. 0 - курс продається з ' +
      'першого модуля. Правило позиційне: це перші N модулів у порядку відображення, ' +
      'тому зміна порядку модулів переносить межу.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(99)
  trial_module_count?: number;
}
