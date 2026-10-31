import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { LessonNotesController } from './lesson-notes.controller';
import { LessonNotesService } from './lesson-notes.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [LessonNotesController],
  providers: [LessonNotesService],
})
export class LessonNotesModule {}
