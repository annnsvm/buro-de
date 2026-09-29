"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressQuizModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const prisma_module_1 = require("../../prisma/prisma.module");
const course_materials_module_1 = require("../course-materials/course-materials.module");
const progress_service_1 = require("./progress.service");
const quiz_service_1 = require("./quiz.service");
const progress_controller_1 = require("./progress.controller");
const course_progress_controller_1 = require("./course-progress.controller");
const quiz_controller_1 = require("./quiz.controller");
let ProgressQuizModule = class ProgressQuizModule {
};
exports.ProgressQuizModule = ProgressQuizModule;
exports.ProgressQuizModule = ProgressQuizModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, user_module_1.UserModule, course_materials_module_1.CourseMaterialsModule],
        controllers: [progress_controller_1.ProgressController, course_progress_controller_1.CourseProgressController, quiz_controller_1.QuizController],
        providers: [progress_service_1.ProgressService, quiz_service_1.QuizService],
        exports: [progress_service_1.ProgressService, quiz_service_1.QuizService],
    })
], ProgressQuizModule);
//# sourceMappingURL=progress-quiz.module.js.map