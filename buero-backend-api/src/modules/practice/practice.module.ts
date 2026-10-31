import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CourseMaterialsModule } from '../course-materials/course-materials.module';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { SpeakingService } from './speaking.service';

/** `AuthModule` and `UserModule` are what the controller's guards depend on. */
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    CourseMaterialsModule,
    /** A student's recording goes to the same storage every other upload does. */
    CloudinaryModule,
  ],
  controllers: [PracticeController],
  providers: [PracticeService, SpeakingService],
  exports: [PracticeService, SpeakingService],
})
export class PracticeModule {}
