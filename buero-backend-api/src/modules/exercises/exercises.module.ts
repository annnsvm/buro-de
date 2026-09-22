import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionSyncService } from './question-sync.service';

/**
 * Everything that knows what a question is: the exercise definitions, the German
 * answer matcher and the service that keeps the questions table in step with the
 * JSON the course editor still writes.
 */
@Module({
  imports: [PrismaModule],
  providers: [QuestionSyncService],
  exports: [QuestionSyncService],
})
export class ExercisesModule {}
