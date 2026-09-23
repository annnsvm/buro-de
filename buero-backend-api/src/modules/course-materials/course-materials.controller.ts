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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from 'src/generated/prisma/enums';
import type { UserWithoutPassword } from '../user/types/user-response.type';
import { QuestionImportService } from '../exercises/import/question-import.service';
import { ImportQuestionsDto } from '../exercises/import/import-questions.dto';
import { QuestionEditorService } from '../exercises/question-editor.service';
import {
  ReorderQuestionsDto,
  SaveQuestionDto,
} from '../exercises/question-editor.dto';
import { CourseMaterialService } from './course-material.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@ApiTags('course-materials')
@Controller('courses/:courseId/modules/:moduleId/materials')
export class CourseMaterialsController {
  constructor(
    private readonly courseMaterialService: CourseMaterialService,
    private readonly questionImport: QuestionImportService,
    private readonly questionEditor: QuestionEditorService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Список матеріалів модуля',
    description:
      'Список матеріалів модуля. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу. 403 при відсутності доступу.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiResponse({ status: 200, description: 'Список матеріалів' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  async list(
    @CurrentUser() user: UserWithoutPassword,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    await this.courseMaterialService.assertCanAccessModule(
      user.id,
      user.role,
      courseId,
      moduleId,
    );
    return this.courseMaterialService.findAllByModuleId(
      courseId,
      moduleId,
      user.role,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Один матеріал по id',
    description:
      'Один матеріал по id. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу. 403 при відсутності доступу.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiResponse({ status: 200, description: 'Матеріал знайдено' })
  @ApiResponse({ status: 403, description: 'Немає доступу до курсу' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  async getById(
    @CurrentUser() user: UserWithoutPassword,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') id: string,
  ) {
    await this.courseMaterialService.assertCanAccessModule(
      user.id,
      user.role,
      courseId,
      moduleId,
    );
    return this.courseMaterialService.findOne(
      courseId,
      moduleId,
      id,
      user.role,
    );
  }

  @Get(":id/questions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Питання квізу для редагування',
    description:
      'Повертає питання разом із правильними відповідями — на відміну від ендпоінту для студента. Тільки для вчителів.',
  })
  @ApiResponse({ status: 200, description: 'Список питань' })
  listQuestions(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') materialId: string,
  ) {
    return this.questionEditor.list(courseId, moduleId, materialId);
  }

  @Post(":id/questions")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Додати питання до квізу' })
  @ApiBody({ type: SaveQuestionDto })
  @ApiResponse({ status: 400, description: 'Питання неможливо пройти' })
  createQuestion(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') materialId: string,
    @Body() dto: SaveQuestionDto,
  ) {
    return this.questionEditor.save(courseId, moduleId, materialId, null, dto);
  }

  @Patch(":id/questions/:questionId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Оновити питання' })
  @ApiBody({ type: SaveQuestionDto })
  updateQuestion(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') materialId: string,
    @Param('questionId') questionId: string,
    @Body() dto: SaveQuestionDto,
  ) {
    return this.questionEditor.save(courseId, moduleId, materialId, questionId, dto);
  }

  @Delete(":id/questions/:questionId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Видалити питання' })
  deleteQuestion(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') materialId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.questionEditor.remove(courseId, moduleId, materialId, questionId);
  }

  @Patch(":id/questions")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Змінити порядок питань' })
  @ApiBody({ type: ReorderQuestionsDto })
  reorderQuestions(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') materialId: string,
    @Body() dto: ReorderQuestionsDto,
  ) {
    return this.questionEditor.reorder(courseId, moduleId, materialId, dto);
  }

  @Post("import")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Імпорт питань із CSV',
    description:
      'Створює квізи модуля з авторського CSV. За замовчуванням лише показує, що буде створено (dry_run). ' +
      'Повторний імпорт того самого файлу оновлює наявні питання, а не дублює їх: ідентифікатор питання береться з колонки ID.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiBody({ type: ImportQuestionsDto })
  @ApiResponse({ status: 200, description: 'Попередній перегляд або результат імпорту' })
  @ApiResponse({ status: 404, description: 'Модуль не знайдено або не належить курсу' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  importQuestions(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: ImportQuestionsDto,
  ) {
    if (dto.dry_run === false) {
      return this.questionImport.commit(courseId, moduleId, dto.csv, dto.mode, {
        passingScore: dto.passing_score,
        acceptAlternatives: dto.accept_alternatives,
      });
    }
    return this.questionImport.preview(courseId, moduleId, dto.csv, dto.mode);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Додати матеріал до модуля',
    description:
      'Тільки для вчителів. Body: type, title, content, order_index. 404, якщо курс або модуль не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiBody({ type: CreateCourseMaterialDto })
  @ApiResponse({ status: 201, description: 'Матеріал створено' })
  @ApiResponse({ status: 404, description: 'Курс або модуль не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  create(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateCourseMaterialDto,
  ) {
    return this.courseMaterialService.create(courseId, moduleId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Оновити матеріал',
    description: 'Тільки для вчителів. Оновити матеріал (поля для оновлення). 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiBody({ type: UpdateCourseMaterialDto })
  @ApiResponse({ status: 200, description: 'Матеріал оновлено' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 400, description: 'Помилка валідації' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  update(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCourseMaterialDto,
  ) {
    return this.courseMaterialService.update(
      courseId,
      moduleId,
      id,
      dto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.teacher)
  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Видалити матеріал',
    description: 'Тільки для вчителів. Видалити матеріал. 404, якщо не знайдено.',
  })
  @ApiParam({ name: 'courseId', description: 'UUID курсу' })
  @ApiParam({ name: 'moduleId', description: 'UUID модуля' })
  @ApiParam({ name: 'id', description: 'UUID матеріалу' })
  @ApiResponse({ status: 200, description: 'Матеріал видалено' })
  @ApiResponse({ status: 404, description: 'Курс, модуль або матеріал не знайдено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 403, description: 'Тільки для вчителів' })
  delete(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('id') id: string,
  ) {
    return this.courseMaterialService.delete(courseId, moduleId, id);
  }
}
