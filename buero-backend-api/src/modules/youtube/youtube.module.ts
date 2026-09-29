import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { YoutubeController } from './youtube.controller';
import { YoutubeService } from './youtube.service';

/** `AuthModule` and `UserModule` are what the controller's guards depend on. */
@Module({
  imports: [AuthModule, UserModule],
  controllers: [YoutubeController],
  providers: [YoutubeService],
})
export class YoutubeModule {}
