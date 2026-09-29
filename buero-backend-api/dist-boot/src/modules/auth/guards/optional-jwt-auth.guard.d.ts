import { ExecutionContext } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
export declare class OptionalJwtAuthGuard extends JwtAuthGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
