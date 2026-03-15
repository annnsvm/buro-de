import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CompleteMaterialDto {
  @ApiProperty({ description: 'Бал за матеріал (опційно)', required: false })
  @IsOptional()
  @IsNumber()
  score?: number;
}
