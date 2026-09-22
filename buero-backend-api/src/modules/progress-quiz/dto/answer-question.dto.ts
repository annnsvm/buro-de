import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';

/** Одна відповідь, надіслана одразу після того, як студент її обрав або ввів. */
export class AnswerQuestionDto {
  @ApiProperty({ example: 'q1', description: 'ID питання' })
  @IsString()
  question_id!: string;

  @ApiProperty({
    description: 'Відповідь: id варіанту, набір id, текст або порядок слів',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  })
  @Allow()
  @IsNotEmpty()
  answer!: string | string[];
}
