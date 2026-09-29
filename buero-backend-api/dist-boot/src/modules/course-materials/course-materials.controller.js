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
exports.CourseMaterialsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const enums_1 = require("src/generated/prisma/enums");
const question_import_service_1 = require("../exercises/import/question-import.service");
const import_questions_dto_1 = require("../exercises/import/import-questions.dto");
const question_editor_service_1 = require("../exercises/question-editor.service");
const question_editor_dto_1 = require("../exercises/question-editor.dto");
const course_material_service_1 = require("./course-material.service");
const create_course_material_dto_1 = require("./dto/create-course-material.dto");
const update_course_material_dto_1 = require("./dto/update-course-material.dto");
let CourseMaterialsController = class CourseMaterialsController {
    constructor(courseMaterialService, questionImport, questionEditor) {
        this.courseMaterialService = courseMaterialService;
        this.questionImport = questionImport;
        this.questionEditor = questionEditor;
    }
    async list(user, courseId, moduleId) {
        await this.courseMaterialService.assertCanAccessModule(user.id, user.role, courseId, moduleId);
        return this.courseMaterialService.findAllByModuleId(courseId, moduleId, user.role);
    }
    async getById(user, courseId, moduleId, id) {
        await this.courseMaterialService.assertCanAccessModule(user.id, user.role, courseId, moduleId);
        return this.courseMaterialService.findOne(courseId, moduleId, id, user.role);
    }
    listQuestions(courseId, moduleId, materialId) {
        return this.questionEditor.list(courseId, moduleId, materialId);
    }
    createQuestion(courseId, moduleId, materialId, dto) {
        return this.questionEditor.save(courseId, moduleId, materialId, null, dto);
    }
    updateQuestion(courseId, moduleId, materialId, questionId, dto) {
        return this.questionEditor.save(courseId, moduleId, materialId, questionId, dto);
    }
    deleteQuestion(courseId, moduleId, materialId, questionId) {
        return this.questionEditor.remove(courseId, moduleId, materialId, questionId);
    }
    reorderQuestions(courseId, moduleId, materialId, dto) {
        return this.questionEditor.reorder(courseId, moduleId, materialId, dto);
    }
    importQuestions(courseId, moduleId, dto) {
        if (dto.dry_run === false) {
            return this.questionImport.commit(courseId, moduleId, dto.csv, dto.mode, {
                passingScore: dto.passing_score,
                acceptAlternatives: dto.accept_alternatives,
            });
        }
        return this.questionImport.preview(courseId, moduleId, dto.csv, dto.mode);
    }
    create(courseId, moduleId, dto) {
        return this.courseMaterialService.create(courseId, moduleId, dto);
    }
    update(courseId, moduleId, id, dto) {
        return this.courseMaterialService.update(courseId, moduleId, id, dto);
    }
    delete(courseId, moduleId, id) {
        return this.courseMaterialService.delete(courseId, moduleId, id);
    }
};
exports.CourseMaterialsController = CourseMaterialsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Список матеріалів модуля',
        description: 'Список матеріалів модуля. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу. 403 при відсутності доступу.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список матеріалів' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Немає доступу до курсу' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс або модуль не знайдено' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CourseMaterialsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Один матеріал по id',
        description: 'Один матеріал по id. Доступ: вчитель — завжди; студент — лише за наявності доступу до курсу. 403 при відсутності доступу.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID матеріалу' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Матеріал знайдено' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Немає доступу до курсу' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс, модуль або матеріал не знайдено' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('courseId')),
    __param(2, (0, common_1.Param)('moduleId')),
    __param(3, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CourseMaterialsController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(":id/questions"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Питання квізу для редагування',
        description: 'Повертає питання разом із правильними відповідями — на відміну від ендпоінту для студента. Тільки для вчителів.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список питань' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "listQuestions", null);
__decorate([
    (0, common_1.Post)(":id/questions"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Додати питання до квізу' }),
    (0, swagger_1.ApiBody)({ type: question_editor_dto_1.SaveQuestionDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Питання неможливо пройти' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, question_editor_dto_1.SaveQuestionDto]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Patch)(":id/questions/:questionId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити питання' }),
    (0, swagger_1.ApiBody)({ type: question_editor_dto_1.SaveQuestionDto }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Param)('questionId')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, question_editor_dto_1.SaveQuestionDto]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)(":id/questions/:questionId"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити питання' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Patch)(":id/questions"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({ summary: 'Змінити порядок питань' }),
    (0, swagger_1.ApiBody)({ type: question_editor_dto_1.ReorderQuestionsDto }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, question_editor_dto_1.ReorderQuestionsDto]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "reorderQuestions", null);
__decorate([
    (0, common_1.Post)("import"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Імпорт питань із CSV',
        description: 'Створює квізи модуля з авторського CSV. За замовчуванням лише показує, що буде створено (dry_run). ' +
            'Повторний імпорт того самого файлу оновлює наявні питання, а не дублює їх: ідентифікатор питання береться з колонки ID.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiBody)({ type: import_questions_dto_1.ImportQuestionsDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Попередній перегляд або результат імпорту' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Модуль не знайдено або не належить курсу' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, import_questions_dto_1.ImportQuestionsDto]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "importQuestions", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Додати матеріал до модуля',
        description: 'Тільки для вчителів. Body: type, title, content, order_index. 404, якщо курс або модуль не знайдено.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiBody)({ type: create_course_material_dto_1.CreateCourseMaterialDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Матеріал створено' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс або модуль не знайдено' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Помилка валідації' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_course_material_dto_1.CreateCourseMaterialDto]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Оновити матеріал',
        description: 'Тільки для вчителів. Оновити матеріал (поля для оновлення). 404, якщо не знайдено.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID матеріалу' }),
    (0, swagger_1.ApiBody)({ type: update_course_material_dto_1.UpdateCourseMaterialDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Матеріал оновлено' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс, модуль або матеріал не знайдено' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Помилка валідації' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_course_material_dto_1.UpdateCourseMaterialDto]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)('access_token'),
    (0, swagger_1.ApiOperation)({
        summary: 'Видалити матеріал',
        description: 'Тільки для вчителів. Видалити матеріал. 404, якщо не знайдено.',
    }),
    (0, swagger_1.ApiParam)({ name: 'courseId', description: 'UUID курсу' }),
    (0, swagger_1.ApiParam)({ name: 'moduleId', description: 'UUID модуля' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID матеріалу' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Матеріал видалено' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Курс, модуль або матеріал не знайдено' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Не авторизовано' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Тільки для вчителів' }),
    __param(0, (0, common_1.Param)('courseId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CourseMaterialsController.prototype, "delete", null);
exports.CourseMaterialsController = CourseMaterialsController = __decorate([
    (0, swagger_1.ApiTags)('course-materials'),
    (0, common_1.Controller)('courses/:courseId/modules/:moduleId/materials'),
    __metadata("design:paramtypes", [course_material_service_1.CourseMaterialService,
        question_import_service_1.QuestionImportService,
        question_editor_service_1.QuestionEditorService])
], CourseMaterialsController);
//# sourceMappingURL=course-materials.controller.js.map