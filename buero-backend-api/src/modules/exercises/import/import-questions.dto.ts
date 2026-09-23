import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { QuizMode } from '../../../generated/prisma/enums';

export class ImportQuestionsDto {
  @ApiProperty({
    description:
      'Вміст CSV-файлу. Колонки: ID, Урок, Тип, Питання, A, B, C, D, Правильна відповідь, Пояснення.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2_000_000)
  csv!: string;

  @ApiProperty({
    enum: QuizMode,
    description:
      'practice — з файлу створюється по квізу на кожен урок із колонки «Урок». ' +
      'test — увесь файл стає одним підсумковим тестом модуля.',
  })
  @IsEnum(QuizMode)
  mode!: QuizMode;

  @ApiPropertyOptional({
    description: 'true — лише показати, що буде створено, нічого не змінюючи.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  dry_run?: boolean;

  @ApiPropertyOptional({ example: 60, description: 'Відсоток для зарахування тесту.' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  passing_score?: number;

  @ApiPropertyOptional({
    description:
      'true — додати до правильних відповідей ті формулювання, які згадані в поясненні як прийнятні. ' +
      'За замовчуванням вони лише показуються у попередньому перегляді.',
  })
  @IsOptional()
  @IsBoolean()
  accept_alternatives?: boolean;
}
