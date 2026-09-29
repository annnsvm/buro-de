"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabularyModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../prisma/prisma.module");
const auth_module_1 = require("../auth/auth.module");
const user_module_1 = require("../user/user.module");
const vocabulary_controller_1 = require("./vocabulary.controller");
const vocabulary_service_1 = require("./vocabulary.service");
let VocabularyModule = class VocabularyModule {
};
exports.VocabularyModule = VocabularyModule;
exports.VocabularyModule = VocabularyModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, user_module_1.UserModule],
        controllers: [vocabulary_controller_1.VocabularyController],
        providers: [vocabulary_service_1.VocabularyService],
    })
], VocabularyModule);
//# sourceMappingURL=vocabulary.module.js.map