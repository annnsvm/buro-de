import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CourseMaterialsModule } from '../course-materials/course-materials.module';
import { WritingController } from './writing.controller';
import { WritingService } from './writing.service';

/**
 * `AuthModule` and `UserModule` are here because the controller's guards depend on them. Leaving
 * them out compiles and passes every unit test, then fails at boot — the dependency graph is
 * only built when the application starts.
 */
@Module({
  imports: [PrismaModule, AuthModule, UserModule, CourseMaterialsModule],
  controllers: [WritingController],
  providers: [WritingService],
  exports: [WritingService],
})
export class WritingModule {}
