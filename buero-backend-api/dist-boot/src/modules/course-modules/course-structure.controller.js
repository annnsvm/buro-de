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
exports.CourseStructureController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("src/generated/prisma/enums");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const course_module_service_1 = require("./course-module.service");
const reorder_course_structure_dto_1 = require("./dto/reorder-course-structure.dto");
let CourseStructureController = class CourseStructureController {
    constructor(courseModuleService) {
        this.courseModuleService = courseModuleService;
    }
    reorder(courseId, dto) {
        return this.courseModuleService.reorderStructure(courseId, dto);
    }
};
exports.CourseStructureController = CourseStructureController;
__decorate([
    (0, common_1.Patch)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Reorder course structure",
        description: "Teacher only. Persists module order and, for every listed material, its position and owning module. Moving a material between modules is supported.",
    }),
    (0, swagger_1.ApiParam)({ name: "courseId", description: "Course UUID" }),
    (0, swagger_1.ApiBody)({ type: reorder_course_structure_dto_1.ReorderCourseStructureDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Updated course structure" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Teachers only" }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: "Course, module or material not found",
    }),
    __param(0, (0, common_1.Param)("courseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_course_structure_dto_1.ReorderCourseStructureDto]),
    __metadata("design:returntype", void 0)
], CourseStructureController.prototype, "reorder", null);
exports.CourseStructureController = CourseStructureController = __decorate([
    (0, swagger_1.ApiTags)("course-modules"),
    (0, common_1.Controller)("courses/:courseId/structure"),
    __metadata("design:paramtypes", [course_module_service_1.CourseModuleService])
], CourseStructureController);
//# sourceMappingURL=course-structure.controller.js.map