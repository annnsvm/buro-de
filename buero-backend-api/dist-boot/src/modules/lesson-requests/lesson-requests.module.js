"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const lesson_requests_controller_1 = require("./lesson-requests.controller");
const lesson_request_service_1 = require("./lesson-request.service");
let LessonRequestsModule = class LessonRequestsModule {
};
exports.LessonRequestsModule = LessonRequestsModule;
exports.LessonRequestsModule = LessonRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, user_module_1.UserModule],
        controllers: [lesson_requests_controller_1.LessonRequestsController],
        providers: [lesson_request_service_1.LessonRequestService],
    })
], LessonRequestsModule);
//# sourceMappingURL=lesson-requests.module.js.map