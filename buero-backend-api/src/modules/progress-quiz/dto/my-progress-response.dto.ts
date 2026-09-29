import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResumeLessonDto {
  @ApiProperty()
  course_id!: string;

  @ApiProperty()
  course_title!: string;

  @ApiProperty({ nullable: true })
  course_level!: string | null;

  @ApiProperty()
  material_id!: string;

  @ApiProperty()
  material_title!: string;

  @ApiProperty({ description: '1-based position of the lesson in the course' })
  lesson_number!: number;

  @ApiProperty()
  lesson_total!: number;
}

export class CourseProgressItemDto {
  @ApiProperty({ description: 'UUID курсу' })
  course_id!: string;

  @ApiProperty({ description: 'Назва курсу' })
  course_title!: string;

  @ApiProperty({ description: 'Відсоток завершення (0–100)' })
  completion_percent!: number;

  @ApiProperty({ description: 'Кількість завершених матеріалів' })
  completed_materials_count!: number;

  @ApiProperty({ description: 'Загальна кількість матеріалів у курсі' })
  total_materials_count!: number;
}

export class MyProgressResponseDto {
  @ApiProperty({ type: [CourseProgressItemDto], description: 'Прогрес по курсах' })
  courses!: CourseProgressItemDto[];

  @ApiProperty({ description: 'Поточний рівень студента (A1 | A2 | B1 | B2)', nullable: true })
  level!: string | null;

  @ApiPropertyOptional({
    type: ResumeLessonDto,
    nullable: true,
    description: 'Останній переглянутий урок серед усіх курсів',
  })
  resume!: ResumeLessonDto | null;
}
