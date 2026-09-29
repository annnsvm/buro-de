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
exports.CourseModulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const enums_1 = require("src/generated/prisma/enums");
const course_module_service_1 = require("./course-module.service");
const create_course_module_dto_1 = require("./dto/create-course-module.dto");
const update_course_module_dto_1 = require("./dto/update-course-module.dto");
let CourseModulesController = class CourseModulesController {
    constructor(courseModuleService) {
        this.courseModuleService = courseModuleService;
    }
    async list(user, courseId) {
        await this.courseModuleService.assertCanAccessCourse(user.id, user.role, courseId);
        return this.courseModuleService.findAllByCourseId(courseId, user.id, user.role);
    }
    async getById(user, courseId, moduleId) {
        return this.courseModuleService.findOne(courseId, moduleId, user.id, user.role);
    }
    create(courseId, dto) {
        return this.courseModuleService.create(courseId, dto);
    }
    update(courseId, moduleId, dto) {
        return this.courseModuleService.update(courseId, moduleId, dto);
    }
    delete(courseId, moduleId) {
        return this.courseModuleService.delete(courseId, moduleId);
    }
};
exports.CourseModulesController = CourseModulesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Список модулів курсу",
        description: "Список модулів курсу за order_index. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "UUID курсу" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Список модулів" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Немає доступу до курсу" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("courseId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CourseModulesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":moduleId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Один модуль по id",
        description: "Один модуль. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "UUID курсу" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "UUID модуля" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Модуль знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Немає доступу до курсу" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс або модуль не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("courseId")),
    __param(2, (0, common_1.Param)("moduleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CourseModulesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Створити модуль у курсі",
        description: "Тільки для вчителів. Body: title, order_index.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "UUID курсу" }),
    (0, swagger_1.ApiBody)({ type: create_course_module_dto_1.CreateCourseModuleDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Модуль створено" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Помилка валідації" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_course_module_dto_1.CreateCourseModuleDto]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":moduleId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Оновити модуль",
        description: "Тільки для вчителів. Оновити модуль (title, order_index).",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "UUID курсу" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "UUID модуля" }),
    (0, swagger_1.ApiBody)({ type: update_course_module_dto_1.UpdateCourseModuleDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Модуль оновлено" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс або модуль не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Param)("moduleId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_course_module_dto_1.UpdateCourseModuleDto]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":moduleId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Видалити модуль",
        description: "Тільки для вчителів. Видалити модуль. Матеріали модуля видаляються каскадно.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "UUID курсу" }),
    (0, swagger_1.ApiParam)({ name: "moduleId", description: "UUID модуля" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Модуль видалено" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс або модуль не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Param)("moduleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CourseModulesController.prototype, "delete", null);
exports.CourseModulesController = CourseModulesController = __decorate([
    (0, swagger_1.ApiTags)("course-modules"),
    (0, common_1.Controller)("courses/:courseId/modules"),
    __metadata("design:paramtypes", [course_module_service_1.CourseModuleService])
], CourseModulesController);
//# sourceMappingURL=course-modules.controller.js.map