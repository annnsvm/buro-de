import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveLessonNoteDto } from './dto/save-lesson-note.dto';
import { LessonNotesService } from './lesson-notes.service';

/**
 * Notes a student keeps for themselves on a lesson.
 *
 * Both routes work on the caller's own note only. The material id says which lesson; it never
 * selects whose note, so one account cannot reach another's.
 */
@ApiTags('lesson-notes')
@Controller('lesson-notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class LessonNotesController {
  constructor(private readonly lessonNotes: LessonNotesService) {}

  @Get(':materialId')
  @ApiOperation({
    summary: 'Моя нотатка до уроку',
    description:
      'Текст нотатки поточного користувача. Якщо нотатки ще немає, повертається порожній текст.',
  })
  @ApiParam({ name: 'materialId', description: 'Id уроку' })
  @ApiResponse({ status: 200, description: 'Нотатка (можливо порожня)' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  read(@CurrentUser('id') userId: string, @Param('materialId') materialId: string) {
    return this.lessonNotes.read(userId, materialId);
  }

  @Put(':materialId')
  @ApiOperation({
    summary: 'Зберегти нотатку до уроку',
    description:
      'Замінює нотатку цілком. Порожній текст прибирає нотатку. Одна нотатка на урок.',
  })
  @ApiParam({ name: 'materialId', description: 'Id уроку' })
  @ApiBody({ type: SaveLessonNoteDto })
  @ApiResponse({ status: 200, description: 'Нотатку збережено' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  @ApiResponse({ status: 404, description: 'Урок не знайдено' })
  save(
    @CurrentUser('id') userId: string,
    @Param('materialId') materialId: string,
    @Body() dto: SaveLessonNoteDto,
  ) {
    return this.lessonNotes.save(userId, materialId, dto.text);
  }
}
