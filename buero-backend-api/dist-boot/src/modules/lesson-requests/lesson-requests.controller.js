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
exports.LessonRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("src/generated/prisma/enums");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const lesson_request_service_1 = require("./lesson-request.service");
const create_lesson_request_dto_1 = require("./dto/create-lesson-request.dto");
const lesson_request_response_dto_1 = require("./dto/lesson-request-response.dto");
let LessonRequestsController = class LessonRequestsController {
    constructor(lessonRequestService) {
        this.lessonRequestService = lessonRequestService;
    }
    create(user, dto) {
        return this.lessonRequestService.create(user.id, user.role, dto);
    }
    findMy(user) {
        return this.lessonRequestService.findMyRequests(user.id, user.role);
    }
    accept(id, user) {
        return this.lessonRequestService.accept(id, user.id, user.role);
    }
    reject(id, user) {
        return this.lessonRequestService.reject(id, user.id, user.role);
    }
    complete(id, user) {
        return this.lessonRequestService.complete(id, user.id, user.role);
    }
    cancel(id, user) {
        return this.lessonRequestService.cancel(id, user.id, user.role);
    }
};
exports.LessonRequestsController = LessonRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(enums_1.Role.student),
    (0, swagger_1.ApiOperation)({
        summary: 'Створити запит на заняття',
        description: 'Студент створює запит (status = pending). Ідентичність береться з access-токена.',
    }),
    (0, swagger_1.ApiBody)({ type: create_lesson_request_dto_1.CreateLessonRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Створений запит',
        type: lesson_request_response_dto_1.LessonRequestResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Невалідні дані' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для студентів' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Користувача не знайдено' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lesson_request_dto_1.CreateLessonRequestDto]),
    __metadata("design:returntype", void 0)
], LessonRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Мої запити',
        description: 'Студент: усі запити з student_id = поточний користувач. Вчитель: усі pending + запити з teacher_id = поточний користувач.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список запитів',
        type: [lesson_request_response_dto_1.LessonRequestResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Користувача не знайдено' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LessonRequestsController.prototype, "findMy", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiOperation)({
        summary: 'Прийняти запит',
        description: 'pending → accepted, teacher_id = поточний вчитель.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID запиту' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Оновлений запит',
        type: lesson_request_response_dto_1.LessonRequestResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Статус не pending' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Запит або користувача не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonRequestsController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiOperation)({
        summary: 'Відхилити запит (до прийняття)',
        description: 'pending → rejected.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID запиту' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Оновлений запит',
        type: lesson_request_response_dto_1.LessonRequestResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Статус не pending' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Запит або користувача не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonRequestsController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiOperation)({
        summary: 'Позначити заняття як проведене',
        description: 'accepted + ваш teacher_id → completed.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID запиту' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Оновлений запит',
        type: lesson_request_response_dto_1.LessonRequestResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Невалідний стан' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Запит або користувача не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonRequestsController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiOperation)({
        summary: 'Скасувати після прийняття',
        description: 'accepted + ваш teacher_id → rejected.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID запиту' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Оновлений запит',
        type: lesson_request_response_dto_1.LessonRequestResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Невалідний стан' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Запит або користувача не знайдено' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LessonRequestsController.prototype, "cancel", null);
exports.LessonRequestsController = LessonRequestsController = __decorate([
    (0, swagger_1.ApiTags)('lesson-requests'),
    (0, common_1.Controller)('lesson-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    __metadata("design:paramtypes", [lesson_request_service_1.LessonRequestService])
], LessonRequestsController);
//# sourceMappingURL=lesson-requests.controller.js.map