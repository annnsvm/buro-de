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
exports.CourseProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const enums_1 = require("src/generated/prisma/enums");
const progress_service_1 = require("./progress.service");
const complete_material_dto_1 = require("./dto/complete-material.dto");
const course_progress_response_dto_1 = require("./dto/course-progress-response.dto");
let CourseProgressController = class CourseProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    getCourseProgress(userId, courseId) {
        return this.progressService.getCourseProgress(userId, courseId);
    }
    completeMaterial(userId, role, courseId, moduleId, materialId, body) {
        return this.progressService.completeMaterial(userId, role, courseId, moduleId, materialId, body === null || body === void 0 ? void 0 : body.score);
    }
};
exports.CourseProgressController = CourseProgressController;
__decorate([
    (0, common_1.Get)(':courseId/progress'),
    (0, swagger_1.ApiOperation)({
        summary: 'Прогрес по курсу',
        description: 'Прогрес по курсу для поточного користувача: список завершених матеріалів (course_progress). Опційно module_id для UI. 404, якщо курс не знайдено. Тільки для студентів.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список завершених матеріалів', type: course_progress_response_dto_1.CourseProgressResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для студентів' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс не знайдено' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CourseProgressController.prototype, "getCourseProgress", null);
__decorate([
    (0, common_1.Post)(':courseId/modules/:moduleId/materials/:materialId/complete'),
    (0, swagger_1.ApiOperation)({
        summary: 'Позначити матеріал пройденим',
        description: 'Створює або оновлює запис у course_progress (completed_at, опційно score). Перевірка курсу, модуля та матеріалу. 404 при відсутності сутності. Тільки для студентів.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiParam)({ name: 'materialId', description: 'UUID матеріалу' }),
    (0, swagger_1.ApiBody)({ type: complete_material_dto_1.CompleteMaterialDto, required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Матеріал позначено пройденим' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Тільки для студентів або немає доступу до курсу',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс, модуль або матеріал не знайдено' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Param)('courseId')),
    __param(3, (0, common_1.Param)('moduleId')),
    __param(4, (0, common_1.Param)('materialId')),
    __param(5, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, complete_material_dto_1.CompleteMaterialDto]),
    __metadata("design:returntype", void 0)
], CourseProgressController.prototype, "completeMaterial", null);
exports.CourseProgressController = CourseProgressController = __decorate([
    (0, swagger_1.ApiTags)('progress'),
    (0, common_1.Controller)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.student),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], CourseProgressController);
//# sourceMappingURL=course-progress.controller.js.map