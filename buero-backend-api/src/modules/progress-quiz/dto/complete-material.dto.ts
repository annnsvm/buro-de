import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CompleteMaterialDto {
  @ApiProperty({
    description: 'Бал за матеріал у відсотках, 0-100 (опційно)',
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;
}
