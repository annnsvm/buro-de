import { Role } from "src/generated/prisma/enums";
export declare const ROLES_KEY = "roles";
export { Role };
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
