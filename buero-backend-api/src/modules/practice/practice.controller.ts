import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { UserWithoutPassword } from '../user/types/user-response.type';
import { PracticeService } from './practice.service';

@ApiTags('practice')
@Controller('practice')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.student)
@ApiBearerAuth('access_token')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

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
}
