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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var CourseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const enums_1 = require("../../generated/prisma/enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const strip_quiz_answers_1 = require("../../common/content/strip-quiz-answers");
const trial_scope_1 = require("../../common/access/trial-scope");
const cloudinary_service_1 = require("../../cloudinary/cloudinary.service");
const list_courses_query_dto_1 = require("./dto/list-courses-query.dto");
const user_service_1 = require("../user/user.service");
const payment_fulfillment_service_1 = require("../subscriptions/payment-fulfillment.service");
const LIST_FRESH_MS = 30000;
const LIST_STALE_MS = 5 * 60000;
let CourseService = CourseService_1 = class CourseService {
    constructor(prisma, configService, userService, cloudinaryService, paymentFulfillment) {
        this.prisma = prisma;
        this.configService = configService;
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.paymentFulfillment = paymentFulfillment;
        this.logger = new common_1.Logger(CourseService_1.name);
        this.listCache = new Map();
        this.listInflight = new Map();
    }
    async findMyAccessibleCourses(userId) {
        try {
            void this.paymentFulfillment.reconcilePendingForUser(userId);
            const [accesses, { videos: videoByCourse, lessons: lessonsByCourse }] = await Promise.all([
                this.prisma.userCourseAccess.findMany({
                    where: { userId },
                    include: { course: true },
                    orderBy: { createdAt: "desc" },
                }),
                this.countLessonsByCourseIds(),
            ]);
            return accesses.map((a) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, this.serializeCourse(a.course)), { videoLessonCount: (_a = videoByCourse.get(a.courseId)) !== null && _a !== void 0 ? _a : 0, lessonsCount: (_b = lessonsByCourse.get(a.courseId)) !== null && _b !== void 0 ? _b : 0, avgVideoLessonMinutes: null, my_access: {
                        access_type: a.accessType,
                    } }));
            });
        }
        catch (error) {
            throw this.mapPrismaError(error);
        }
    }
    async findAll(filters, opts) {
        var _a, _b;
        try {
            const pubFilter = (_a = opts === null || opts === void 0 ? void 0 : opts.publicationFilter) !== null && _a !== void 0 ? _a : list_courses_query_dto_1.PublicationStatus.published;
            const where = {};
            if (pubFilter === list_courses_query_dto_1.PublicationStatus.published)
                where.isPublished = true;
            else if (pubFilter === list_courses_query_dto_1.PublicationStatus.unpublished)
                where.isPublished = false;
            if (filters === null || filters === void 0 ? void 0 : filters.language)
                where.language = filters.language;
            if (filters === null || filters === void 0 ? void 0 : filters.level) {
                const order = Object.values(enums_1.Level);
                const at = order.indexOf(filters.level);
                where.AND = [
                    {
                        OR: [
                            { level: filters.level, levelTo: null },
                            {
                                level: { in: order.slice(0, at + 1) },
                                levelTo: { in: order.slice(at) },
                            },
                        ],
                    },
                ];
            }
            const searchTrim = (_b = filters === null || filters === void 0 ? void 0 : filters.search) === null || _b === void 0 ? void 0 : _b.trim();
            if (searchTrim) {
                where.OR = [
                    { title: { contains: searchTrim, mode: "insensitive" } },
                    { description: { contains: searchTrim, mode: "insensitive" } },
                ];
            }
            const splitTags = (value) => value
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean);
            if (filters === null || filters === void 0 ? void 0 : filters.tags) {
                const tagsArray = splitTags(filters.tags);
                if (tagsArray.length > 0)
                    where.tags = { hasSome: tagsArray };
            }
            if (filters === null || filters === void 0 ? void 0 : filters.tags_exclude) {
                const excluded = splitTags(filters.tags_exclude);
                if (excluded.length > 0)
                    where.NOT = { tags: { hasSome: excluded } };
            }
            const cacheKey = JSON.stringify({ pubFilter, filters: filters !== null && filters !== void 0 ? filters : {} });
            const cached = this.listCache.get(cacheKey);
            const age = cached ? Date.now() - cached.at : Number.POSITIVE_INFINITY;
            if (cached && age < LIST_FRESH_MS) {
                return cached.data;
            }
            if (cached && age < LIST_STALE_MS) {
                void this.refreshCourseList(cacheKey, where).catch((error) => {
                    this.logger.warn(`Catalog refresh failed: ${error instanceof Error ? error.message : String(error)}`);
                });
                return cached.data;
            }
            return await this.refreshCourseList(cacheKey, where);
        }
        catch (error) {
            throw this.mapPrismaError(error);
        }
    }
    async findById(id, includeModules = true, viewer) {
        var _a;
        try {
            const userId = (_a = viewer === null || viewer === void 0 ? void 0 : viewer.id) !== null && _a !== void 0 ? _a : null;
            const [course, access] = await Promise.all([
                includeModules
                    ? this.loadCourseTree(id)
                    : this.prisma.course.findUnique({ where: { id } }),
                userId
                    ? this.prisma.userCourseAccess.findUnique({
                        where: { userId_courseId: { userId, courseId: id } },
                    })
                    : Promise.resolve(null),
            ]);
            if (!course) {
                throw new common_1.NotFoundException(`Курс з id ${id} не знайдено`);
            }
            const isTeacher = (viewer === null || viewer === void 0 ? void 0 : viewer.role) === enums_1.Role.teacher;
            if (course.isPublished !== true && !isTeacher) {
                throw new common_1.NotFoundException(`Курс з id ${id} не знайдено`);
            }
            const orderedModules = "modules" in course && Array.isArray(course.modules)
                ? course.modules
                : [];
            const trialModuleIds = orderedModules
                .slice(0, trial_scope_1.TRIAL_FREE_MODULE_COUNT)
                .map((mod) => (typeof mod.id === "string" ? mod.id : null))
                .filter((moduleId) => moduleId !== null);
            const scoped = this.applyContentAccess(course, this.resolveReadableModules(access, isTeacher, trialModuleIds), isTeacher);
            const serialized = this.serializeCourse(scoped);
            if (!access)
                return serialized;
            const my_access = Object.assign({ access_type: access.accessType }, (access.accessType === "trial" &&
                trialModuleIds.length > 0 && {
                first_module_id: trialModuleIds[0],
                trial_module_ids: trialModuleIds,
            }));
            return Object.assign(Object.assign({}, serialized), { my_access });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapPrismaError(error);
        }
    }
    resolveReadableModules(access, isTeacher, trialModuleIds) {
        if (isTeacher)
            return "all";
        if (!access)
            return new Set();
        if (access.accessType === enums_1.UserCourseAccessType.trial) {
            return new Set(trialModuleIds);
        }
        return "all";
    }
    applyContentAccess(course, readable, isTeacher) {
        const modules = course.modules;
        if (!Array.isArray(modules))
            return course;
        return Object.assign(Object.assign({}, course), { modules: modules.map((mod) => {
                const materials = mod.materials;
                if (!Array.isArray(materials))
                    return mod;
                const moduleId = typeof mod.id === "string" ? mod.id : "";
                const unlocked = readable === "all" || readable.has(moduleId);
                return Object.assign(Object.assign({}, mod), { materials: materials.map((mat) => this.applyMaterialAccess(mat, unlocked, isTeacher)) });
            }) });
    }
    applyMaterialAccess(material, unlocked, isTeacher) {
        const { content, attachments } = material, rest = __rest(material, ["content", "attachments"]);
        const base = Object.assign(Object.assign({}, rest), { duration: this.extractDuration(content), locked: !unlocked });
        if (!unlocked) {
            return Object.assign(Object.assign({}, base), { content: null, attachments: [] });
        }
        return Object.assign(Object.assign({}, base), { content: isTeacher ? (content !== null && content !== void 0 ? content : null) : (0, strip_quiz_answers_1.stripQuizAnswers)(content), attachments: attachments !== null && attachments !== void 0 ? attachments : [] });
    }
    extractDuration(content) {
        if (!content || typeof content !== "object")
            return null;
        const value = content.duration;
        return typeof value === "string" && value.trim() ? value : null;
    }
    async create(dto) {
        var _a, _b, _c, _d;
        try {
            const maxOrder = await this.prisma.course.aggregate({
                _max: { orderIndex: true },
            });
            const nextOrderIndex = ((_a = maxOrder._max.orderIndex) !== null && _a !== void 0 ? _a : -1) + 1;
            const course = await this.prisma.course.create({
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ title: dto.title, description: (_b = dto.description) !== null && _b !== void 0 ? _b : null, language: dto.language, isPublished: (_c = dto.is_published) !== null && _c !== void 0 ? _c : false, orderIndex: nextOrderIndex }, (dto.price !== undefined && { price: dto.price })), { tags: (_d = dto.tags) !== null && _d !== void 0 ? _d : [] }), (dto.level !== undefined && { level: dto.level })), (dto.level_to !== undefined && { levelTo: dto.level_to })), (dto.duration_hours !== undefined && {
                    durationHours: dto.duration_hours,
                })),
            });
            this.clearCourseCaches();
            return this.serializeCourse(course);
        }
        catch (error) {
            throw this.mapPrismaError(error);
        }
    }
    async reorderCourses(dto) {
        try {
            const ids = dto.items.map((item) => item.id);
            const existingCount = await this.prisma.course.count({
                where: { id: { in: ids } },
            });
            if (existingCount !== ids.length) {
                throw new common_1.NotFoundException("Один або кілька курсів не знайдено");
            }
            await this.prisma.$transaction(dto.items.map((item) => this.prisma.course.update({
                where: { id: item.id },
                data: { orderIndex: item.order_index },
            })));
            this.clearCourseCaches();
            return { updated: dto.items.length };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapPrismaError(error);
        }
    }
    async update(id, dto) {
        try {
            const existing = await this.prisma.course.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    price: true,
                    isPublished: true,
                },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Курс з id ${id} не знайдено`);
            }
            const updateData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (dto.title !== undefined && { title: dto.title })), (dto.description !== undefined && {
                description: dto.description,
            })), (dto.language !== undefined && { language: dto.language })), (dto.is_published !== undefined && {
                isPublished: dto.is_published,
            })), (dto.price !== undefined && { price: dto.price })), (dto.tags !== undefined && { tags: dto.tags })), (dto.level !== undefined && { level: dto.level })), (dto.level_to !== undefined && { levelTo: dto.level_to })), (dto.duration_hours !== undefined && {
                durationHours: dto.duration_hours,
            }));
            const course = await this.prisma.course.update({
                where: { id },
                data: updateData,
            });
            this.clearCourseCaches();
            return this.serializeCourse(course);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            if (error instanceof common_1.BadRequestException)
                throw error;
            this.logger.error(`Course update failed for id ${id}: ${error instanceof Error ? error.message : String(error)}`);
            throw this.mapPrismaError(error);
        }
    }
    priceToNumber(price) {
        if (price == null)
            return null;
        if (typeof price === "number" && Number.isFinite(price))
            return price;
        if (typeof price === "object" && "toString" in price) {
            const n = Number(price.toString());
            return Number.isFinite(n) ? n : null;
        }
        return null;
    }
    async delete(id) {
        try {
            const existing = await this.prisma.course.findUnique({
                where: { id },
                select: { id: true },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Курс з id ${id} не знайдено`);
            }
            await this.prisma.course.delete({
                where: { id },
            });
            this.clearCourseCaches();
            return { deleted: true, id };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw this.mapPrismaError(error);
        }
    }
    async uploadCover(courseId, file) {
        try {
            const existing = await this.prisma.course.findUnique({
                where: { id: courseId },
                select: { id: true },
            });
            if (!existing) {
                throw new common_1.NotFoundException(`Курс з id ${courseId} не знайдено`);
            }
            const secureUrl = await this.cloudinaryService.uploadImage(file.buffer, {
                folder: "courses",
                publicId: courseId,
            });
            const course = await this.prisma.course.update({
                where: { id: courseId },
                data: { imageUrl: secureUrl },
            });
            this.clearCourseCaches();
            return this.serializeCourse(course);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw error;
        }
    }
    async startTrial(userId, courseId) {
        try {
            const course = await this.prisma.course.findUnique({
                where: { id: courseId },
                select: { id: true, isPublished: true },
            });
            if (!course) {
                throw new common_1.NotFoundException(`Курс з id ${courseId} не знайдено`);
            }
            if (course.isPublished !== true) {
                throw new common_1.BadRequestException("Курс не опублікований");
            }
            const lessonsCount = await this.getCourseMaterialsCount(courseId);
            if (lessonsCount < 1) {
                throw new common_1.BadRequestException("Курс ще не містить уроків і недоступний для trial");
            }
            const user = await this.userService.findUserById(userId);
            if (!user)
                throw new common_1.NotFoundException(`Користувач з id ${userId} не знайдено`);
            if (user.role !== enums_1.Role.student) {
                throw new common_1.BadRequestException("Тільки студент може активувати trial");
            }
            const existingAccess = await this.prisma.userCourseAccess.findUnique({
                where: { userId_courseId: { userId, courseId } },
            });
            if (existingAccess) {
                throw new common_1.ConflictException("У вас вже є доступ до цього курсу (trial, купівля або підписка)");
            }
            await this.prisma.userCourseAccess.create({
                data: {
                    userId,
                    courseId,
                    accessType: enums_1.UserCourseAccessType.trial,
                },
            });
            return {
                course_id: courseId,
                access_type: "trial",
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw this.mapPrismaError(error);
        }
    }
    clearCourseCaches() {
        this.listCache.clear();
        this.listInflight.clear();
    }
    refreshCourseList(cacheKey, where) {
        const inflight = this.listInflight.get(cacheKey);
        if (inflight)
            return inflight;
        const task = (async () => {
            const [courses, { videos: videoByCourse, lessons: lessonsByCourse }] = await Promise.all([
                this.prisma.course.findMany({
                    where,
                    orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
                }),
                this.countLessonsByCourseIds(),
            ]);
            const list = courses.map((c) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, this.serializeCourse(c)), { videoLessonCount: (_a = videoByCourse.get(c.id)) !== null && _a !== void 0 ? _a : 0, lessonsCount: (_b = lessonsByCourse.get(c.id)) !== null && _b !== void 0 ? _b : 0, avgVideoLessonMinutes: null }));
            });
            this.listCache.set(cacheKey, { at: Date.now(), data: list });
            return list;
        })().finally(() => {
            this.listInflight.delete(cacheKey);
        });
        this.listInflight.set(cacheKey, task);
        return task;
    }
    async loadCourseTree(id) {
        var _a, _b, _c, _d, _e;
        const [course, modules, materials, questionBlocks, attachments] = await Promise.all([
            this.prisma.course.findUnique({ where: { id } }),
            this.prisma.courseModule.findMany({
                where: { courseId: id },
                orderBy: { orderIndex: "asc" },
            }),
            this.prisma.courseMaterial.findMany({
                where: { module: { courseId: id } },
                orderBy: { orderIndex: "asc" },
                select: {
                    id: true,
                    moduleId: true,
                    type: true,
                    title: true,
                    content: true,
                    quizMode: true,
                    passingScore: true,
                    parentMaterialId: true,
                    orderIndex: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.question.groupBy({
                by: ["materialId", "block"],
                where: { material: { module: { courseId: id } } },
            }),
            this.prisma.materialAttachment.findMany({
                where: { material: { module: { courseId: id } } },
                orderBy: { orderIndex: "asc" },
                select: {
                    id: true,
                    materialId: true,
                    kind: true,
                    title: true,
                    url: true,
                    fileName: true,
                    mimeType: true,
                    sizeBytes: true,
                    orderIndex: true,
                },
            }),
        ]);
        if (!course)
            return null;
        const blockOrder = Object.values(enums_1.PracticeBlock);
        const blocksByMaterial = new Map();
        for (const row of questionBlocks) {
            const found = (_a = blocksByMaterial.get(row.materialId)) !== null && _a !== void 0 ? _a : [];
            found.push(row.block);
            blocksByMaterial.set(row.materialId, found);
        }
        for (const [materialId, blocks] of blocksByMaterial) {
            blocksByMaterial.set(materialId, blockOrder.filter((block) => blocks.includes(block)));
        }
        const attachmentsByMaterial = new Map();
        for (const item of attachments) {
            const { materialId } = item, rest = __rest(item, ["materialId"]);
            const list = (_b = attachmentsByMaterial.get(materialId)) !== null && _b !== void 0 ? _b : [];
            list.push(rest);
            attachmentsByMaterial.set(materialId, list);
        }
        const materialsByModule = new Map();
        for (const material of materials) {
            const list = (_c = materialsByModule.get(material.moduleId)) !== null && _c !== void 0 ? _c : [];
            list.push(Object.assign(Object.assign({}, material), { blocks: (_d = blocksByMaterial.get(material.id)) !== null && _d !== void 0 ? _d : [], attachments: (_e = attachmentsByMaterial.get(material.id)) !== null && _e !== void 0 ? _e : [] }));
            materialsByModule.set(material.moduleId, list);
        }
        return Object.assign(Object.assign({}, course), { modules: modules.map((mod) => {
                var _a;
                return (Object.assign(Object.assign({}, mod), { materials: (_a = materialsByModule.get(mod.id)) !== null && _a !== void 0 ? _a : [] }));
            }) });
    }
    async countLessonsByCourseIds() {
        const rows = await this.prisma.$queryRaw `
      SELECT
        m.course_id AS course_id,
        COUNT(mat.id)::int AS lessons,
        COUNT(mat.id) FILTER (WHERE mat.type = 'video')::int AS videos
      FROM course_modules m
      LEFT JOIN course_materials mat ON mat.module_id = m.id
      GROUP BY m.course_id
    `;
        const lessons = new Map();
        const videos = new Map();
        for (const row of rows) {
            lessons.set(row.course_id, Number(row.lessons));
            videos.set(row.course_id, Number(row.videos));
        }
        return { lessons, videos };
    }
    async getCourseMaterialsCount(courseId) {
        return this.prisma.courseMaterial.count({
            where: { module: { courseId } },
        });
    }
    serializeCourse(course) {
        if (course == null || typeof course !== "object")
            return course;
        const price = course.price;
        const priceAsNumber = price != null && typeof price === "object" && "toString" in price
            ? Number(price.toString())
            : price != null
                ? Number(price)
                : null;
        const _a = course, { imageUrl } = _a, rest = __rest(_a, ["imageUrl"]);
        return Object.assign(Object.assign({}, this.stripAttachmentStorageKeys(rest)), { price: priceAsNumber, image_url: imageUrl !== null && imageUrl !== void 0 ? imageUrl : null });
    }
    stripAttachmentStorageKeys(course) {
        const modules = course.modules;
        if (!Array.isArray(modules))
            return course;
        return Object.assign(Object.assign({}, course), { modules: modules.map((mod) => {
                const materials = mod.materials;
                if (!Array.isArray(materials))
                    return mod;
                return Object.assign(Object.assign({}, mod), { materials: materials.map((mat) => {
                        const attachments = mat.attachments;
                        if (!Array.isArray(attachments))
                            return mat;
                        return Object.assign(Object.assign({}, mat), { attachments: attachments.map((item) => {
                                const { storageKey: _storageKey } = item, rest = __rest(item, ["storageKey"]);
                                return rest;
                            }) });
                    }) });
            }) });
    }
    mapPrismaError(error) {
        if (error instanceof common_1.NotFoundException)
            throw error;
        if (error instanceof common_1.BadRequestException)
            throw error;
        const message = error instanceof Error ? error.message : "Unknown error";
        throw new common_1.BadRequestException(message);
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = CourseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        user_service_1.UserService,
        cloudinary_service_1.CloudinaryService,
        payment_fulfillment_service_1.PaymentFulfillmentService])
], CourseService);
//# sourceMappingURL=course.service.js.map