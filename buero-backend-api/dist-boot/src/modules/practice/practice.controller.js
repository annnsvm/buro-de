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
exports.PracticeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("src/generated/prisma/enums");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const practice_service_1 = require("./practice.service");
let PracticeController = class PracticeController {
    constructor(practiceService) {
        this.practiceService = practiceService;
    }
    getOverview(user, materialId) {
        return this.practiceService.getOverview(materialId, user.id, user.role);
    }
};
exports.PracticeController = PracticeController;
__decorate([
    (0, common_1.Get)('materials/:materialId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Хаб практики уроку',
        description: 'Які блоки має практика і скільки в кожному пройдено. Блок вважається пройденим, коли ' +
            'студент відповів на всі питання в ньому; правильність на це не впливає, але бал ' +
            'показується.',
    }),
    (0, swagger_1.ApiParam)({ name: 'materialId', description: 'UUID матеріалу типу practice' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Блоки і прогрес' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('materialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PracticeController.prototype, "getOverview", null);
exports.PracticeController = PracticeController = __decorate([
    (0, swagger_1.ApiTags)('practice'),
    (0, common_1.Controller)('practice'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.student),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    __metadata("design:paramtypes", [practice_service_1.PracticeService])
], PracticeController);
//# sourceMappingURL=practice.controller.js.map