import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export type ApiErrorBody = {
    statusCode: number;
    error: string;
    message: string | string[] | Record<string, unknown>;
    timestamp: string;
    path: string;
    stack?: string;
};
export declare class AllExceptionsFilter implements ExceptionFilter<unknown> {
    private readonly isProduction;
    private readonly logger;
    constructor(isProduction: boolean);
    catch(exception: unknown, host: ArgumentsHost): void;
    private parseHttpException;
    private defaultErrorLabel;
    private logHttpException;
}
