import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { UserWithoutPassword } from '../user/types/user-response.type';
import { LessonRequestService } from './lesson-request.service';
import { CreateLessonRequestDto } from './dto/create-lesson-request.dto';
import { LessonRequestResponseDto } from './dto/lesson-request-response.dto';

@ApiTags('lesson-requests')
@Controller('lesson-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access_token')
export class LessonRequestsController {
  constructor(private readonly lessonRequestService: LessonRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.student)
  @ApiOperation({
    summary: 'Створити запит на заняття',
    description:
      'Студент створює запит (status = pending). Ідентичність береться з access-токена.',
  })
  @ApiBody({ type: CreateLessonRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Створений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для студентів' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  create(
    @CurrentUser() user: UserWithoutPassword,
    @Body() dto: CreateLessonRequestDto,
  ) {
    return this.lessonRequestService.create(user.id, user.role, dto);
  }

  @Get('me')
  @ApiOperation({
    summary: 'Мої запити',
    description:
      'Студент: усі запити з student_id = поточний користувач. Вчитель: усі pending + запити з teacher_id = поточний користувач.',
  })
  @ApiResponse({
    status: 200,
    description: 'Список запитів',
    type: [LessonRequestResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  findMy(@CurrentUser() user: UserWithoutPassword) {
    return this.lessonRequestService.findMyRequests(user.id, user.role);
  }

  @Patch(':id/accept')
  @Roles(Role.teacher)
  @ApiOperation({
    summary: 'Прийняти запит',
    description: 'pending → accepted, teacher_id = поточний вчитель.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Статус не pending' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  accept(
    @Param('id') id: string,
    @CurrentUser() user: UserWithoutPassword,
  ) {
    return this.lessonRequestService.accept(id, user.id, user.role);
  }

  @Patch(':id/reject')
  @Roles(Role.teacher)
  @ApiOperation({
    summary: 'Відхилити запит (до прийняття)',
    description: 'pending → rejected.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Статус не pending' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  reject(
    @Param('id') id: string,
    @CurrentUser() user: UserWithoutPassword,
  ) {
    return this.lessonRequestService.reject(id, user.id, user.role);
  }

  @Patch(':id/complete')
  @Roles(Role.teacher)
  @ApiOperation({
    summary: 'Позначити заняття як проведене',
    description: 'accepted + ваш teacher_id → completed.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалідний стан' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  complete(
    @Param('id') id: string,
    @CurrentUser() user: UserWithoutPassword,
  ) {
    return this.lessonRequestService.complete(id, user.id, user.role);
  }

  @Patch(':id/cancel')
  @Roles(Role.teacher)
  @ApiOperation({
    summary: 'Скасувати після прийняття',
    description: 'accepted + ваш teacher_id → rejected.',
  })
  @ApiParam({ name: 'id', description: 'UUID запиту' })
  @ApiResponse({
    status: 200,
    description: 'Оновлений запит',
    type: LessonRequestResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Невалідний стан' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  @ApiResponse({ status: 404, description: 'Запит або користувача не знайдено' })
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: UserWithoutPassword,
  ) {
    return this.lessonRequestService.cancel(id, user.id, user.role);
  }
}
