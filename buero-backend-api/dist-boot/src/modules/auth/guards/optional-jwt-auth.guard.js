"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalJwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
let OptionalJwtAuthGuard = class OptionalJwtAuthGuard extends jwt_auth_guard_1.JwtAuthGuard {
    async canActivate(context) {
        try {
            return await super.canActivate(context);
        }
        catch (_a) {
            return true;
        }
    }
};
exports.OptionalJwtAuthGuard = OptionalJwtAuthGuard;
exports.OptionalJwtAuthGuard = OptionalJwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], OptionalJwtAuthGuard);
//# sourceMappingURL=optional-jwt-auth.guard.js.map