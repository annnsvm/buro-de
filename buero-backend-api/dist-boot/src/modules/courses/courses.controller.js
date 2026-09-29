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
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const enums_1 = require("src/generated/prisma/enums");
const course_service_1 = require("./course.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const list_courses_query_dto_1 = require("./dto/list-courses-query.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const reorder_courses_dto_1 = require("./dto/reorder-courses.dto");
const multer_exception_filter_1 = require("./filters/multer-exception.filter");
const multer_course_cover_config_1 = require("./multer-course-cover.config");
let CoursesController = class CoursesController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    list(query) {
        return this.courseService.findAll(query, {
            publicationFilter: list_courses_query_dto_1.PublicationStatus.published,
        });
    }
    manage(query) {
        var _a;
        const publicationFilter = (_a = query.publication_status) !== null && _a !== void 0 ? _a : list_courses_query_dto_1.PublicationStatus.all;
        return this.courseService.findAll(query, { publicationFilter });
    }
    myAccessibleCourses(userId) {
        return this.courseService.findMyAccessibleCourses(userId);
    }
    getById(user, id) {
        return this.courseService.findById(id, true, user ? { id: user.id, role: user.role } : null);
    }
    create(dto) {
        return this.courseService.create(dto);
    }
    reorder(dto) {
        return this.courseService.reorderCourses(dto);
    }
    update(id, dto) {
        return this.courseService.update(id, dto);
    }
    delete(id) {
        return this.courseService.delete(id);
    }
    uploadCover(id, file) {
        var _a;
        if (!((_a = file === null || file === void 0 ? void 0 : file.buffer) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new common_1.BadRequestException("Потрібно передати файл у полі file (multipart/form-data)");
        }
        return this.courseService.uploadCover(id, file);
    }
    startTrial(userId, id) {
        return this.courseService.startTrial(userId, id);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Список опублікованих курсів (каталог)",
        description: "Публічний каталог опублікованих курсів (is_published = true). Опційні query: search (підрядок у title АБО description, без урахування регістру), language, tags (через кому), level. У відповіді: price, tags, level, durationHours, videoLessonCount, lessonsCount, avgVideoLessonMinutes (середня тривалість відеоуроку).",
    }),
    (0, swagger_1.ApiQuery)({
        name: "search",
        required: false,
        description: "Пошук по назві або опису курсу",
    }),
    (0, swagger_1.ApiQuery)({ name: "language", required: false, enum: ["en", "de"] }),
    (0, swagger_1.ApiQuery)({
        name: "tags",
        required: false,
        description: "Фільтр за тегами (через кому). Напр. Language,Integration",
    }),
    (0, swagger_1.ApiQuery)({ name: "level", required: false, enum: ["A1", "A2", "B1", "B2"] }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Масив опублікованих курсів (поля: price, tags, level, durationHours, image_url, videoLessonCount тощо)",
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_courses_query_dto_1.ListCoursesQueryDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("manage"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Усі курси для управління (вчитель)",
        description: "Список усіх курсів (опублікованих і неопублікованих). Тільки для вчителів. Ті ж query-параметри, що й для каталогу: search, language, tags, level.",
    }),
    (0, swagger_1.ApiQuery)({
        name: "search",
        required: false,
        description: "Пошук по назві або опису курсу",
    }),
    (0, swagger_1.ApiQuery)({ name: "language", required: false, enum: ["en", "de"] }),
    (0, swagger_1.ApiQuery)({
        name: "tags",
        required: false,
        description: "Фільтр за тегами (через кому)",
    }),
    (0, swagger_1.ApiQuery)({ name: "level", required: false, enum: ["A1", "A2", "B1", "B2"] }),
    (0, swagger_1.ApiQuery)({
        name: "publication_status",
        required: false,
        enum: list_courses_query_dto_1.PublicationStatus,
        description: "all — усі, published — тільки опубліковані, unpublished — тільки неопубліковані. За замовчуванням all.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Масив курсів з videoLessonCount",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Доступ тільки для вчителів" }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_courses_query_dto_1.ListCoursesQueryDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "manage", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Мої курси (з доступом)",
        description: "Список курсів, до яких у поточного користувача є активний доступ: trial (не прострочений), purchase або subscription. JWT обов'язковий. Порожній масив, якщо доступів немає.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Масив курсів з videoLessonCount та my_access: { access_type, trial_ends_at? }",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "myAccessibleCourses", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Один курс по id (з модулями та матеріалами)",
        description: "Структура курсу (модулі + матеріали) з поетапним доступом до вмісту. JWT опційний. " +
            "Завжди повертаються id, title, type, order_index та duration матеріалу. " +
            "Поле content і attachments приходять лише для доступних модулів: " +
            "вчителю — усі; після купівлі чи підписки — усі; на trial — лише вступні модулі (0 і 1); " +
            "гостю та після закінчення trial — жодного (content: null, locked: true). " +
            "Правильні відповіді на квізи не повертаються нікому — перевірка виконується на сервері. " +
            "Неопубліковані курси видно лише вчителю (інакше 404). " +
            "За наявності доступу у відповіді також my_access.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "UUID курсу" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Курс з полем modules; кожен модуль містить materials",
        schema: {
            example: {
                id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                teacherId: "u1000000-0000-0000-0000-000000000001",
                title: "German A1 Basics",
                description: "Introduction to German language.",
                language: "en",
                isPublished: true,
                price: 29.99,
                tags: ["Language", "Integration"],
                level: "A1",
                durationHours: 12,
                createdAt: "2025-02-16T10:00:00.000Z",
                updatedAt: "2025-02-16T10:00:00.000Z",
                modules: [
                    {
                        id: "m1000000-0000-0000-0000-000000000001",
                        courseId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                        title: "Module 1: Basics",
                        orderIndex: 0,
                        createdAt: "2025-02-16T10:00:00.000Z",
                        updatedAt: "2025-02-16T10:00:00.000Z",
                        materials: [
                            {
                                id: "mat10000-0000-0000-0000-00000000001",
                                moduleId: "m1000000-0000-0000-0000-000000000001",
                                type: "video",
                                title: "Greetings",
                                duration: "07:12",
                                locked: false,
                                content: { youtube_video_id: "abc123", duration: "07:12" },
                                attachments: [],
                                orderIndex: 0,
                                createdAt: "2025-02-16T10:00:00.000Z",
                                updatedAt: "2025-02-16T10:00:00.000Z",
                            },
                            {
                                id: "mat10000-0000-0000-0000-00000000002",
                                moduleId: "m1000000-0000-0000-0000-000000000001",
                                type: "quiz",
                                title: "Module 1 check",
                                duration: null,
                                locked: true,
                                content: null,
                                attachments: [],
                                orderIndex: 1,
                                createdAt: "2025-02-16T10:00:00.000Z",
                                updatedAt: "2025-02-16T10:00:00.000Z",
                            },
                        ],
                    },
                    {
                        id: "m1000000-0000-0000-0000-000000000002",
                        courseId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                        title: "Module 2: Grammar",
                        orderIndex: 1,
                        createdAt: "2025-02-16T10:00:00.000Z",
                        updatedAt: "2025-02-16T10:00:00.000Z",
                        materials: [],
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "При наявному доступі до курсу у відповіді є my_access: { access_type, trial_ends_at?, first_module_id? }",
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Створити курс",
        description: "Тільки для вчителів. Створити новий курс. Повертає створений курс.",
    }),
    (0, swagger_1.ApiBody)({ type: create_course_dto_1.CreateCourseDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Курс створено" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Помилка валідації" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)("reorder"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Змінити порядок курсів у каталозі",
        description: "Тільки для вчителів. Body: items — масив { id, order_index }. Оновлює order_index для кожного курсу.",
    }),
    (0, swagger_1.ApiBody)({ type: reorder_courses_dto_1.ReorderCoursesDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Порядок оновлено" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reorder_courses_dto_1.ReorderCoursesDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Оновити курс",
        description: "Тільки для вчителів. Оновити курс за id. Поля body: title, description, language, is_published, price, tags, level, duration_hours (усі опційні). 404, якщо не знайдено.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "UUID курсу" }),
    (0, swagger_1.ApiBody)({ type: update_course_dto_1.UpdateCourseDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Курс оновлено" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Помилка валідації" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Видалити курс",
        description: "Видалити курс за id. Модулі та матеріали видаляються каскадно. 404, якщо не знайдено.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "UUID курсу" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Курс видалено" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(":id/cover"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.teacher),
    (0, common_1.UseFilters)(multer_exception_filter_1.MulterExceptionFilter),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", multer_course_cover_config_1.courseCoverMulterOptions)),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Завантажити обкладинку курсу",
        description: "Тільки для вчителів. Multipart поле **file** (JPEG, PNG, WebP, до 5 MB). Файл завантажується в Cloudinary (папка `courses`), у БД зберігається `secure_url` у `image_url`. Повертає оновлений курс (як у PATCH). 404, якщо курс не знайдено.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "UUID курсу" }),
    (0, swagger_1.ApiBody)({
        description: "Обкладинка курсу",
        schema: {
            type: "object",
            required: ["file"],
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description: "Зображення: image/jpeg, image/png, image/webp",
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Курс оновлено; у відповіді є image_url (URL з Cloudinary)",
        schema: {
            example: {
                id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                title: "German A1 Basics",
                image_url: "https://res.cloudinary.com/demo/image/upload/v1/courses/xxx.jpg",
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Файл відсутній, невалідний тип або > 5 MB",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для вчителів" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Помилка Cloudinary" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "uploadCover", null);
__decorate([
    (0, common_1.Post)(":id/start-trial"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.student),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    (0, swagger_1.ApiOperation)({
        summary: "Розпочати пробний період",
        description: "Тільки для студентів. Розпочати пробний період для курсу (доступ до двох вступних модулів: модуль 0 з інструкціями та перший навчальний модуль). Повертає course_id, access_type, trial_ends_at.",
    }),
    (0, swagger_1.ApiParam)({ name: "id", description: "UUID курсу" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Пробний період розпочато",
        schema: {
            type: "object",
            properties: {
                course_id: {
                    type: "string",
                    format: "uuid",
                    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                },
                access_type: { type: "string", enum: ["trial"], example: "trial" },
                trial_ends_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-07T12:00:00.000Z",
                },
            },
            required: ["course_id", "access_type", "trial_ends_at"],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Курс не опублікований або не студент",
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Курс не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "Вже є доступ до курсу" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для студентів" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CoursesController.prototype, "startTrial", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)("courses"),
    (0, common_1.Controller)("courses"),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map