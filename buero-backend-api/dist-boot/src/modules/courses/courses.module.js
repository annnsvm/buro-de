"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesModule = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_module_1 = require("../../cloudinary/cloudinary.module");
const prisma_module_1 = require("../../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const subscriptions_module_1 = require("../subscriptions/subscriptions.module");
const user_module_1 = require("../user/user.module");
const course_service_1 = require("./course.service");
const courses_controller_1 = require("./courses.controller");
let CoursesModule = class CoursesModule {
};
exports.CoursesModule = CoursesModule;
exports.CoursesModule = CoursesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            cloudinary_module_1.CloudinaryModule,
            subscriptions_module_1.SubscriptionsModule,
        ],
        controllers: [courses_controller_1.CoursesController],
        providers: [course_service_1.CourseService],
        exports: [course_service_1.CourseService],
    })
], CoursesModule);
//# sourceMappingURL=courses.module.js.map