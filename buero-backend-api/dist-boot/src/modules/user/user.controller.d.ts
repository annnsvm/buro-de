import { UserService } from "./user.service";
import { UpdateProfileDto } from "./dto/update-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(userId: string): Promise<{
        user: import("./types/user-response.type").UserWithoutPassword;
        profile: Record<string, unknown>;
    }>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<{
        user: import("./types/user-response.type").UserWithoutPassword;
        profile: Record<string, unknown>;
    }>;
}
