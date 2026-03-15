import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({ description: 'Індекс блоку питання' })
  @IsNumber()
  block_index!: number;

  @ApiProperty({ description: 'ID питання в блоці' })
  @IsString()
  question_id!: string;

  @ApiProperty({ description: 'Відповідь (рядок або ID варіанту)', oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] })
  answer!: string | string[];
}
