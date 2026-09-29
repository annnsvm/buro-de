import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { YoutubeService } from './youtube.service';

@ApiTags('youtube')
@Controller('youtube')
@UseGuards(JwtAuthGuard, RolesGuard)
/** Only the teacher authors videos, so nobody else needs this and nobody else may call it. */
@Roles(Role.teacher)
@ApiBearerAuth('access_token')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('preview/:videoId')
  @ApiOperation({
    summary: 'Назва та обкладинка відео',
    description:
      'Дані з YouTube без ключа API, щоб не вводити назву руками. Якщо відео не знайдено, ' +
      'повертається found: false — це не помилка, назву завжди можна написати самому.',
  })
  @ApiParam({ name: 'videoId', description: 'Ідентифікатор відео YouTube' })
  @ApiResponse({ status: 200, description: 'Назва й обкладинка або found: false' })
  getPreview(@Param('videoId') videoId: string) {
    return this.youtubeService.getPreview(videoId);
  }
}
