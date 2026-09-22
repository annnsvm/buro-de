import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { CourseMaterialService } from './course-material.service';
import { CourseMaterialsController } from './course-materials.controller';
import { UserModule } from '../user/user.module';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, ExercisesModule],
  controllers: [CourseMaterialsController],
  providers: [CourseMaterialService],
  exports: [CourseMaterialService],
})
export class CourseMaterialsModule {}
