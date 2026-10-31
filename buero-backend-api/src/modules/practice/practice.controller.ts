import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { UserWithoutPassword } from '../user/types/user-response.type';
import { practiceAudioMulterOptions } from '../exercises/multer-practice-audio.config';
import { PracticeService } from './practice.service';
import { SpeakingService } from './speaking.service';

@ApiTags('practice')
@Controller('practice')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth('access_token')
export class PracticeController {
  constructor(
    private readonly practiceService: PracticeService,
    private readonly speakingService: SpeakingService,
  ) {}

  @Get('materials/:materialId')
  @ApiOperation({
    summary: 'Хаб практики уроку',
    description:
      'Які блоки має практика і скільки в кожному пройдено. Блок вважається пройденим, коли ' +
      'студент відповів на всі питання в ньому; правильність на це не впливає, але бал ' +
      'показується.',
  })
  @ApiParam({ name: 'materialId', description: 'UUID матеріалу типу practice' })
  @ApiResponse({ status: 200, description: 'Блоки і прогрес' })
  getOverview(
    @CurrentUser() user: UserWithoutPassword,
    @Param('materialId') materialId: string,
  ) {
    return this.practiceService.getOverview(materialId, user.id, user.role);
  }

  @Get('materials/:materialId/speaking')
  @ApiOperation({
    summary: 'Завдання блоку Sprechen',
    description:
      'Завдання на говоріння однієї практики і те, що студент уже записав. Зразкова ' +
      'відповідь і слова-опори віддаються лише після того, як є запис: прочитати гарну ' +
      'відповідь до того, як сказати свою, означає переписати її, а не скласти.',
  })
  @ApiParam({ name: 'materialId', description: 'UUID матеріалу типу practice' })
  @ApiResponse({ status: 200, description: 'Завдання і записи студента' })
  getSpeakingTasks(
    @CurrentUser() user: UserWithoutPassword,
    @Param('materialId') materialId: string,
  ) {
    return this.speakingService.getTasks(materialId, user.id, user.role);
  }

  @Post('speaking/:elementId/recording')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', practiceAudioMulterOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        duration_seconds: { type: 'integer' },
      },
    },
  })
  @ApiOperation({
    summary: 'Зберегти запис студента',
    description:
      'Один запис на завдання: новий замінює попередній, бо сказати тричі й залишити ' +
      'найкраще - це і є нормальний спосіб користуватися цим завданням. Оцінки немає: ' +
      'студент слухає себе і порівнює зі зразком сам.',
  })
  @ApiParam({ name: 'elementId', description: 'UUID завдання на говоріння' })
  @ApiResponse({ status: 200, description: 'Запис збережено, зразок відкрито' })
  @ApiResponse({ status: 400, description: 'Запис не надіслано або порожній' })
  saveRecording(
    @CurrentUser() user: UserWithoutPassword,
    @Param('elementId') elementId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('duration_seconds') durationSeconds?: string,
  ) {
    const seconds = Number(durationSeconds);
    return this.speakingService.saveRecording(
      elementId,
      user.id,
      user.role,
      file,
      Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds) : undefined,
    );
  }
}
