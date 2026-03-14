import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ProgressService } from './progress.service';
import { QuizService } from './quiz.service';
import { ProgressController } from './progress.controller';
import { CourseProgressController } from './course-progress.controller';
import { QuizController } from './quiz.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    ProgressController,
    CourseProgressController,
    QuizController,
  ],
  providers: [ProgressService, QuizService],
  exports: [ProgressService, QuizService],
})
export class ProgressQuizModule {}
