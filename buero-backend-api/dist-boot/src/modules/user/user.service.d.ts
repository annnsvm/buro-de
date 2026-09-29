import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UserWithoutPassword } from "./types/user-response.type";
import { Language, Role } from "src/generated/prisma/enums";
import { User } from "src/generated/prisma/client";
export declare class UserService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    private hashToken;
    signAccessToken(userId: string, role?: Role): string;
    createRefreshToken(userId: string): Promise<string>;
    findRefreshToken(token: string): Promise<{
        id: string;
        userId: string;
    } | null>;
    revokeRefreshToken(token: string): Promise<void>;
    toUserWithoutPassword(user: {
        passwordHash: string;
        [key: string]: unknown;
    }): UserWithoutPassword;
    createUser(dto: CreateUserDto): Promise<UserWithoutPassword>;
    createUserFromHashes(params: {
        email: string;
        name?: string | null;
        passwordHash: string;
        role: Role;
        language: Language;
    }): Promise<UserWithoutPassword>;
    findUserByEmail(email: string): Promise<UserWithoutPassword | null>;
    findUserById(id: string): Promise<UserWithoutPassword | null>;
    validatePassword(user: {
        passwordHash: string;
    }, plainPassword: string): Promise<boolean>;
    getProfile(userId: string): Promise<{
        user: UserWithoutPassword;
        profile: Record<string, unknown>;
    } | null>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        user: UserWithoutPassword;
        profile: Record<string, unknown>;
    } | null>;
    findUserByEmailWithPassword(email: string): Promise<User | null>;
    findUserByIdWithPassword(id: string): Promise<User | null>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<UserWithoutPassword>;
}
