import { type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import { MulterError } from "multer";
export declare class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: MulterError, host: ArgumentsHost): void;
}
