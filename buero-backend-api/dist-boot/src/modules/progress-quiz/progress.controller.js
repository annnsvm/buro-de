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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const enums_1 = require("src/generated/prisma/enums");
const progress_service_1 = require("./progress.service");
const my_progress_response_dto_1 = require("./dto/my-progress-response.dto");
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    getMyProgress(userId) {
        return this.progressService.getMyProgress(userId);
    }
    getRecommendedNext(userId) {
        return this.progressService.getRecommendedNext(userId);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Загальний прогрес',
        description: 'Загальний прогрес поточного користувача: курси, відсотки завершення, пройдені матеріали, поточний рівень (student_profiles). Тільки для студентів.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Прогрес', type: my_progress_response_dto_1.MyProgressResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для студентів' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.Get)('recommended-next'),
    (0, swagger_1.ApiOperation)({
        summary: 'Рекомендований наступний курс',
        description: 'Пропонує наступний курс за рівнем студента (student_profiles.level) та course_progress. Один курс або null. Тільки для студентів.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Курс або null' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для студентів' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getRecommendedNext", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('progress'),
    (0, common_1.Controller)('progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.student),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map