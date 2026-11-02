import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WritingUsageService, type UsageReport } from './writing-usage.service';

/**
 * The spend report, kept in a controller of its own.
 *
 * `WritingController` is marked `@Roles(Role.student)` for the whole class, which is right for
 * every endpoint in it - a student's own task, a student's own submission. This one is the
 * opposite: it reads every student's spending, so it belongs behind a different role and not
 * inside a class whose default is the one that must never see it.
 */
@ApiTags('writing')
@Controller('writing/usage')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access_token')
@Roles(Role.teacher)
export class WritingUsageController {
  constructor(private readonly usage: WritingUsageService) {}

  @Get()
  @ApiOperation({
    summary: 'Витрати на перевірку письма за місяць',
    description:
      'Загальна сума, розподіл за моделями і за студентами. Рахується з токенів, ' +
      'збережених при кожній перевірці, а не з середньої ціни. Перевірки, модель яких ' +
      'невідома, у суму не входять і показані окремо полем unpriced_checks.',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    example: '2026-11',
    description: 'Місяць у форматі YYYY-MM. Без нього - поточний.',
  })
  async monthly(@Query('month') month?: string): Promise<UsageReport> {
    return this.usage.monthlyReport(month || undefined);
  }
}
