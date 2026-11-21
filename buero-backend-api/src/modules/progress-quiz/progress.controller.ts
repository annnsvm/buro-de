import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { ProgressService } from './progress.service';
import { MyProgressResponseDto } from './dto/my-progress-response.dto';
import { OpenLessonDto } from './dto/open-lesson.dto';

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth('access_token')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Загальний прогрес',
    description:
      'Загальний прогрес поточного користувача: курси, відсотки завершення, пройдені матеріали, поточний рівень (student_profiles). Тільки для студентів.',
  })
  @ApiResponse({ status: 200, description: 'Прогрес', type: MyProgressResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  getMyProgress(@CurrentUser('id') userId: string) {
    return this.progressService.getMyProgress(userId);
  }

  /**
   * The student opened a lesson.
   *
   * It has to be said out loud like this because opening a lesson asks the server for
   * nothing: the whole course tree arrives in one request and moving between lessons is
   * navigation inside the page. The first attempt hung this on the single-material endpoint,
   * which only the editor calls - so nothing was ever recorded and "continue" went on
   * guessing from finished work.
   */
  @Post('opened')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Позначити урок як відкритий',
    description:
      'Запам\'ятовує, який урок студент відкрив останнім, щоб блок "продовжити" вів саме до нього. ' +
      'Нічого не повертає. Тільки для студентів.',
  })
  @ApiResponse({ status: 204, description: 'Записано' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Матеріал не належить курсу' })
  markLessonOpened(
    @CurrentUser('id') userId: string,
    @Body() dto: OpenLessonDto,
  ): Promise<void> {
    return this.progressService.markLessonOpened(
      userId,
      dto.course_id,
      dto.course_material_id,
    );
  }

  @Get('recommended-next')
  @ApiOperation({
    summary: 'Рекомендований наступний курс',
    description:
      'Пропонує наступний курс за рівнем студента (student_profiles.level) та course_progress. Один курс або null. Тільки для студентів.',
  })
  @ApiResponse({ status: 200, description: 'Курс або null' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  getRecommendedNext(@CurrentUser('id') userId: string) {
    return this.progressService.getRecommendedNext(userId);
  }
}
