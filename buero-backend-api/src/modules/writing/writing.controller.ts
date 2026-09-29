import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { UserWithoutPassword } from '../user/types/user-response.type';
import { SubmitWritingDto } from './dto/submit-writing.dto';
import { WritingService } from './writing.service';

@ApiTags('writing')
@Controller('writing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth('access_token')
export class WritingController {
  constructor(private readonly writingService: WritingService) {}

  @Get('materials/:materialId')
  @ApiOperation({
    summary: 'Письмове завдання',
    description:
      'Умова, критерії оцінювання, скільки спроб лишилось і найкращий результат студента. ' +
      'Критерії показуються до написання: оцінювання за списком, якого студент не бачив, ' +
      'виглядає свавільним.',
  })
  @ApiParam({ name: 'materialId', description: 'UUID матеріалу типу writing' })
  @ApiResponse({ status: 200, description: 'Завдання і стан спроб' })
  @ApiResponse({ status: 403, description: 'Немає доступу до модуля' })
  @ApiResponse({ status: 404, description: 'Матеріал не знайдено' })
  getTask(
    @CurrentUser() user: UserWithoutPassword,
    @Param('materialId') materialId: string,
  ) {
    return this.writingService.getTask(materialId, user.id, user.role);
  }

  @Post('materials/:materialId/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Надіслати лист на перевірку',
    description:
      'Повертає одне з трьох: graded — оцінку за кожним критерієм; needs_more — лист закороткий ' +
      'або без формул, спроба не зараховується; blocked — спроби вичерпано або спрацював ' +
      'запобіжник, і тоді завдання переходить у самоперевірку.',
  })
  @ApiParam({ name: 'materialId', description: 'UUID матеріалу типу writing' })
  @ApiResponse({ status: 200, description: 'Результат перевірки' })
  submit(
    @CurrentUser() user: UserWithoutPassword,
    @Param('materialId') materialId: string,
    @Body() dto: SubmitWritingDto,
  ) {
    return this.writingService.submit(materialId, user.id, user.role, dto.text);
  }
}
