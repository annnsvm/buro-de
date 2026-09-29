import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CourseMaterialsModule } from '../course-materials/course-materials.module';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';

/** `AuthModule` and `UserModule` are what the controller's guards depend on. */
@Module({
  imports: [PrismaModule, AuthModule, UserModule, CourseMaterialsModule],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService],
})
export class PracticeModule {}
