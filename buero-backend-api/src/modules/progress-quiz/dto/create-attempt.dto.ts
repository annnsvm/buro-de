import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateAttemptDto {
  @ApiProperty({ description: 'UUID матеріалу типу quiz' })
  @IsUUID()
  course_material_id!: string;
}
