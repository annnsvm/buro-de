"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabularyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_vocabulary_dto_1 = require("./dto/create-vocabulary.dto");
const update_vocabulary_dto_1 = require("./dto/update-vocabulary.dto");
const vocabulary_service_1 = require("./vocabulary.service");
let VocabularyController = class VocabularyController {
    constructor(vocabularyService) {
        this.vocabularyService = vocabularyService;
    }
    findAll(userId, search) {
        return this.vocabularyService.findAllForUser(userId, search);
    }
    create(userId, dto) {
        return this.vocabularyService.create(userId, dto);
    }
    update(userId, id, dto) {
        return this.vocabularyService.update(userId, id, dto);
    }
    delete(userId, id) {
        return this.vocabularyService.delete(userId, id);
    }
};
exports.VocabularyController = VocabularyController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Мій словник',
        description: 'Слова поточного користувача, найновіші першими. Опційний query search шукає по слову та перекладу.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Пошук по слову або перекладу' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список слів користувача' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Додати слово до свого словника',
        description: 'Слово має бути унікальним у межах вашого словника.',
    }),
    (0, swagger_1.ApiBody)({ type: create_vocabulary_dto_1.CreateVocabularyDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Слово додано' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Таке слово вже є у вашому словнику' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vocabulary_dto_1.CreateVocabularyDto]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити своє слово' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID слова' }),
    (0, swagger_1.ApiBody)({ type: update_vocabulary_dto_1.UpdateVocabularyDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Слово оновлено' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Слово не знайдено у вашому словнику' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_vocabulary_dto_1.UpdateVocabularyDto]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити своє слово' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID слова' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Слово видалено' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Слово не знайдено у вашому словнику' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VocabularyController.prototype, "delete", null);
exports.VocabularyController = VocabularyController = __decorate([
    (0, swagger_1.ApiTags)('vocabulary'),
    (0, common_1.Controller)('vocabulary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    __metadata("design:paramtypes", [vocabulary_service_1.VocabularyService])
], VocabularyController);
//# sourceMappingURL=vocabulary.controller.js.map