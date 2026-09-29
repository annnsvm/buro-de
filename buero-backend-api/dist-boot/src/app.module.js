"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const wayforpay_module_1 = require("./modules/wayforpay/wayforpay.module");
const courses_module_1 = require("./modules/courses/courses.module");
const course_modules_module_1 = require("./modules/course-modules/course-modules.module");
const course_materials_module_1 = require("./modules/course-materials/course-materials.module");
const material_attachments_module_1 = require("./modules/material-attachments/material-attachments.module");
const health_module_1 = require("./health/health.module");
const prisma_module_1 = require("./prisma/prisma.module");
const subscriptions_module_1 = require("./modules/subscriptions/subscriptions.module");
const progress_quiz_module_1 = require("./modules/progress-quiz/progress-quiz.module");
const practice_module_1 = require("./modules/practice/practice.module");
const writing_module_1 = require("./modules/writing/writing.module");
const vocabulary_module_1 = require("./modules/vocabulary/vocabulary.module");
const lesson_requests_module_1 = require("./modules/lesson-requests/lesson-requests.module");
const contact_module_1 = require("./modules/contact/contact.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                useFactory: (config) => {
                    const ttlSec = Number(config.get("THROTTLE_TTL")) || 60;
                    const limit = Number(config.get("THROTTLE_LIMIT")) || 100;
                    const e2e = config.get("E2E_TEST") === "true";
                    return {
                        skipIf: () => e2e,
                        throttlers: [
                            { name: "default", ttl: ttlSec * 1000, limit },
                        ],
                    };
                },
                inject: [config_1.ConfigService],
            }),
            prisma_module_1.PrismaModule,
            wayforpay_module_1.WayForPayModule,
            health_module_1.HealthModule,
            courses_module_1.CoursesModule,
            course_modules_module_1.CourseModulesModule,
            course_materials_module_1.CourseMaterialsModule,
            material_attachments_module_1.MaterialAttachmentsModule,
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            jwt_1.JwtModule.registerAsync({
                global: true,
                useFactory: (config) => {
                    var _a;
                    return ({
                        secret: config.get("JWT_ACCESS_SECRET"),
                        signOptions: {
                            expiresIn: ((_a = config.get("JWT_ACCESS_EXPIRES_IN")) !== null && _a !== void 0 ? _a : "30m"),
                        },
                    });
                },
                inject: [config_1.ConfigService],
            }),
            subscriptions_module_1.SubscriptionsModule,
            progress_quiz_module_1.ProgressQuizModule,
            practice_module_1.PracticeModule,
            writing_module_1.WritingModule,
            vocabulary_module_1.VocabularyModule,
            lesson_requests_module_1.LessonRequestsModule,
            contact_module_1.ContactModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map