import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PracticeBlock } from '../../../generated/prisma/enums';

export class CreateAttemptDto {
  @ApiProperty({ description: 'UUID матеріалу типу quiz' })
  @IsUUID()
  course_material_id!: string;

  /**
   * Which block of a practice is being sat. A quiz and a module test are answered whole
   * and leave it out, which is how every existing caller behaves.
   */
  @ApiPropertyOptional({ enum: PracticeBlock })
  @IsOptional()
  @IsEnum(PracticeBlock)
  block?: PracticeBlock;
}
