import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SubmitWritingDto {
  @ApiProperty({
    description: 'Текст, який написав студент',
    example: 'Sehr geehrte Frau Schmidt, ich bin heute krank …',
  })
  @IsString()
  @MinLength(1)
  /**
   * A hard ceiling before anything is read. The task asks for six to eight sentences, so
   * anything past a few thousand characters is either a mistake or an attempt to run the bill
   * up — and refusing it here costs nothing.
   */
  @MaxLength(5000)
  text!: string;
}
