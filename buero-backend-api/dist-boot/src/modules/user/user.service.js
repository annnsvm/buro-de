"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const prisma_service_1 = require("src/prisma/prisma.service");
const SALT_ROUNDS = 10;
let UserService = class UserService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    hashToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    }
    signAccessToken(userId, role) {
        var _a;
        return this.jwtService.sign(Object.assign({ sub: userId }, (role ? { role } : {})), {
            secret: this.configService.get("JWT_ACCESS_SECRET"),
            expiresIn: ((_a = this.configService.get("JWT_ACCESS_EXPIRES_IN")) !== null && _a !== void 0 ? _a : "30m"),
        });
    }
    async createRefreshToken(userId) {
        var _a;
        const expiresIn = ((_a = this.configService.get("JWT_REFRESH_EXPIRES_IN")) !== null && _a !== void 0 ? _a : "30m");
        const secret = this.configService.get("JWT_REFRESH_SECRET");
        const token = this.jwtService.sign({ sub: userId }, {
            secret,
            expiresIn,
        });
        const tokenHash = this.hashToken(token);
        const decoded = this.jwtService.decode(token);
        const expiresAt = (decoded === null || decoded === void 0 ? void 0 : decoded.exp)
            ? new Date(decoded.exp * 1000)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });
        return token;
    }
    async findRefreshToken(token) {
        const secret = this.configService.get("JWT_REFRESH_SECRET");
        try {
            this.jwtService.verify(token, { secret });
        }
        catch (_a) {
            return null;
        }
        const tokenHash = this.hashToken(token);
        const record = await this.prisma.refreshToken.findFirst({
            where: { tokenHash, revokedAt: null },
        });
        return record ? { id: record.id, userId: record.userId } : null;
    }
    async revokeRefreshToken(token) {
        const tokenHash = this.hashToken(token);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash },
            data: { revokedAt: new Date() },
        });
    }
    toUserWithoutPassword(user) {
        const { passwordHash: _ } = user, rest = __rest(user, ["passwordHash"]);
        return rest;
    }
    async createUser(dto) {
        const existing = await this.prisma.user.findFirst({
            where: { email: dto.email, deletedAt: null },
        });
        if (existing) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const role = dto.role;
        const language = dto.language;
        const name = dto.name == null
            ? null
            : (typeof dto.name === "string" ? dto.name.trim() : "") || null;
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                name,
                passwordHash,
                role,
                language: language || "en",
            },
        });
        if (role === "student") {
            await this.prisma.studentProfile.create({
                data: {
                    userId: user.id,
                },
            });
        }
        else {
            await this.prisma.teacherProfile.create({
                data: {
                    userId: user.id,
                },
            });
        }
        return this.toUserWithoutPassword(user);
    }
    async createUserFromHashes(params) {
        const email = params.email.toLowerCase();
        const existing = await this.prisma.user.findFirst({
            where: { email, deletedAt: null },
        });
        if (existing) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const name = params.name == null
            ? null
            : (typeof params.name === "string" ? params.name.trim() : "") || null;
        const user = await this.prisma.user.create({
            data: {
                email,
                name,
                passwordHash: params.passwordHash,
                role: params.role,
                language: params.language || "en",
            },
        });
        if (params.role === "student") {
            await this.prisma.studentProfile.create({
                data: { userId: user.id },
            });
        }
        else {
            await this.prisma.teacherProfile.create({
                data: { userId: user.id },
            });
        }
        return this.toUserWithoutPassword(user);
    }
    async findUserByEmail(email) {
        const user = await this.prisma.user.findFirst({
            where: { email: email, deletedAt: null },
        });
        return user ? this.toUserWithoutPassword(user) : null;
    }
    async findUserById(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
        });
        return user ? this.toUserWithoutPassword(user) : null;
    }
    async validatePassword(user, plainPassword) {
        return bcrypt.compare(plainPassword, user.passwordHash);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            include: {
                studentProfile: true,
                teacherProfile: true,
            },
        });
        if (!user)
            return null;
        const { studentProfile, teacherProfile } = user, userRest = __rest(user, ["studentProfile", "teacherProfile"]);
        const profile = user.role === "student" ? studentProfile : teacherProfile;
        if (!profile)
            return null;
        return {
            user: this.toUserWithoutPassword(userRest),
            profile: profile,
        };
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            include: { studentProfile: true, teacherProfile: true },
        });
        if (!user)
            return null;
        if (dto.name !== undefined) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { name: dto.name.trim() || null },
            });
        }
        if (user.role === "student") {
            if (dto.timezone !== undefined) {
                await this.prisma.studentProfile.updateMany({
                    where: { userId },
                    data: { timezone: dto.timezone },
                });
            }
            if (dto.language !== undefined) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { language: dto.language },
                });
            }
        }
        else {
            if (dto.bio !== undefined) {
                await this.prisma.teacherProfile.updateMany({
                    where: { userId },
                    data: { bio: dto.bio },
                });
            }
            if (dto.isActive !== undefined) {
                await this.prisma.teacherProfile.updateMany({
                    where: { userId },
                    data: { isActive: dto.isActive },
                });
            }
            if (dto.language !== undefined) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { language: dto.language },
                });
            }
        }
        return this.getProfile(userId);
    }
    async findUserByEmailWithPassword(email) {
        const user = await this.prisma.user.findFirst({
            where: { email: email, deletedAt: null },
        });
        if (!user)
            return null;
        return user;
    }
    async findUserByIdWithPassword(id) {
        return this.prisma.user.findFirst({
            where: { id, deletedAt: null },
        });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.findUserByIdWithPassword(userId);
        if (!user)
            throw new common_1.NotFoundException("User not found");
        const valid = await this.validatePassword(user, currentPassword);
        if (!valid) {
            throw new common_1.UnauthorizedException("Invalid current password");
        }
        const same = await bcrypt.compare(newPassword, user.passwordHash);
        if (same) {
            throw new common_1.BadRequestException("New password must be different from the current password");
        }
        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
        const updated = await this.findUserById(userId);
        if (!updated)
            throw new common_1.NotFoundException("User not found");
        return updated;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], UserService);
//# sourceMappingURL=user.service.js.map