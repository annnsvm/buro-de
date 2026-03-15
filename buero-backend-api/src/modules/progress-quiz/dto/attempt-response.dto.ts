import { ApiProperty } from '@nestjs/swagger';

export class AttemptResponseDto {
  @ApiProperty({ description: 'UUID спроби' })
  id!: string;

  @ApiProperty({ description: 'UUID матеріалу (квізу)' })
  course_material_id!: string;

  @ApiProperty({ description: 'Статус: in_progress | completed' })
  status!: 'in_progress' | 'completed';

  @ApiProperty({ description: 'Збережені відповіді (для resume)', nullable: true })
  answers_snapshot!: Record<string, unknown> | null;

  @ApiProperty({ description: 'Бал після завершення', nullable: true })
  score!: number | null;

  @ApiProperty({ description: 'Час завершення', nullable: true })
  completed_at!: string | null;

  @ApiProperty({ description: 'Час створення спроби' })
  created_at!: string;
}
