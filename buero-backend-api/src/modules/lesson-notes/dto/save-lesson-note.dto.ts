import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SaveLessonNoteDto {
  @ApiProperty({
    example: 'weil - дієслово в кінці. Перевірити Perfekt з sein.',
    description:
      'Нотатка студента до цього уроку. Порожній текст означає, що нотатку прибрано.',
  })
  /**
   * Not `IsNotEmpty`: clearing the box is a thing a person does on purpose, and refusing it
   * would leave them unable to remove a note they no longer want.
   */
  @IsString()
  @MaxLength(20000, {
    message: 'Нотатка задовга: максимум 20000 символів.',
  })
  text!: string;
}
