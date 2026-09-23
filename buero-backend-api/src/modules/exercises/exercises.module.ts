import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionImportService } from './import/question-import.service';
import { QuestionEditorService } from './question-editor.service';

/**
 * Everything that knows what a question is: the exercise definitions, the German
 * answer matcher and the service that keeps the questions table in step with the
 * JSON the course editor still writes.
 */
@Module({
  imports: [PrismaModule],
  providers: [QuestionImportService, QuestionEditorService],
  exports: [QuestionImportService, QuestionEditorService],
})
export class ExercisesModule {}
