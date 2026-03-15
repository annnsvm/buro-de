import { ApiProperty } from '@nestjs/swagger';

export class CompletedMaterialItemDto {
  @ApiProperty({ description: 'UUID матеріалу' })
  course_material_id!: string;

  @ApiProperty({ description: 'UUID модуля (опційно для UI)' })
  module_id?: string;

  @ApiProperty({ description: 'Дата/час завершення' })
  completed_at!: string;

  @ApiProperty({ description: 'Бал (якщо є)', nullable: true })
  score?: number | null;
}

export class CourseProgressResponseDto {
  @ApiProperty({ type: [CompletedMaterialItemDto], description: 'Список завершених матеріалів' })
  completed_materials!: CompletedMaterialItemDto[];
}
