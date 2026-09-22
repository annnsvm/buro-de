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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { VocabularyService } from './vocabulary.service';

/**
 * Personal word list. Every route works on the caller's own words only; there is no
 * endpoint that returns another account's vocabulary, and none that lists all of it.
 */
@ApiTags('vocabulary')
@Controller('vocabulary')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access_token')
export class VocabularyController {
  constructor(private readonly vocabularyService: VocabularyService) {}

  @Get()
  @ApiOperation({
    summary: 'Мій словник',
    description:
      'Слова поточного користувача, найновіші першими. Опційний query search шукає по слову та перекладу.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Пошук по слову або перекладу' })
  @ApiResponse({ status: 200, description: 'Список слів користувача' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  findAll(@CurrentUser('id') userId: string, @Query('search') search?: string) {
    return this.vocabularyService.findAllForUser(userId, search);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Додати слово до свого словника',
    description: 'Слово має бути унікальним у межах вашого словника.',
  })
  @ApiBody({ type: CreateVocabularyDto })
  @ApiResponse({ status: 201, description: 'Слово додано' })
  @ApiResponse({ status: 409, description: 'Таке слово вже є у вашому словнику' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateVocabularyDto) {
    return this.vocabularyService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити своє слово' })
  @ApiParam({ name: 'id', description: 'UUID слова' })
  @ApiBody({ type: UpdateVocabularyDto })
  @ApiResponse({ status: 200, description: 'Слово оновлено' })
  @ApiResponse({ status: 404, description: 'Слово не знайдено у вашому словнику' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateVocabularyDto,
  ) {
    return this.vocabularyService.update(userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити своє слово' })
  @ApiParam({ name: 'id', description: 'UUID слова' })
  @ApiResponse({ status: 200, description: 'Слово видалено' })
  @ApiResponse({ status: 404, description: 'Слово не знайдено у вашому словнику' })
  @ApiResponse({ status: 401, description: 'Не авторизовано' })
  delete(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.vocabularyService.delete(userId, id);
  }
}
