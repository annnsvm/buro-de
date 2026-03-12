import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ListCoursesQueryDto } from './dto/list-courses-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({
    summary: 'Список опублікованих курсів',
    description: 'Повертає курси з is_published = true. Опційні фільтри: category, language.',
  })
  @ApiQuery({ name: 'category', required: false, enum: ['language', 'sociocultural'] })
  @ApiQuery({ name: 'language', required: false, enum: ['en', 'de'] })
  @ApiResponse({ status: 200, description: 'Список курсів' })
  list(@Query() query: ListCoursesQueryDto) {
    return this.courseService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Один курс по id',
    description: 'Повертає курс за ідентифікатором. 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'id', description: 'UUID курсу' })
  @ApiResponse({ status: 200, description: 'Курс знайдено' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  getById(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Створити курс',
    description: 'Тільки для вчителів. Створити новий курс. Повертає створений курс.',
  })
  @ApiBody({ type: CreateCourseDto })
  @ApiResponse({ status: 201, description: 'Курс створено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Оновити курс',
    description: 'Тільки для вчителів. Оновити курс за id. Поля body: title, description, language, category, is_published (усі опційні). 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'id', description: 'UUID курсу' })
  @ApiBody({ type: UpdateCourseDto })
  @ApiResponse({ status: 200, description: 'Курс оновлено' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Видалити курс',
    description: 'Видалити курс за id. Пов’язані course_materials видаляються каскадно. 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'id', description: 'UUID курсу' })
  @ApiResponse({ status: 200, description: 'Курс видалено' })
  @ApiResponse({ status: 404, description: 'Курс не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  delete(@Param('id') id: string) {
    return this.courseService.delete(id);
  }
}
