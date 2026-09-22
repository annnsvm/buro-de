import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { LessonRequestsController } from './lesson-requests.controller';
import { LessonRequestService } from './lesson-request.service';

/** AuthModule and UserModule supply what JwtAuthGuard and RolesGuard inject. */
@Module({
  imports: [PrismaModule, AuthModule, UserModule],
  controllers: [LessonRequestsController],
  providers: [LessonRequestService],
})
export class LessonRequestsModule {}
