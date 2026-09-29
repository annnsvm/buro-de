"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor(isProduction) {
        this.isProduction = isProduction;
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        var _a, _b;
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const path = (_b = (_a = req.url) !== null && _a !== void 0 ? _a : req.originalUrl) !== null && _b !== void 0 ? _b : "";
        const timestamp = new Date().toISOString();
        if (exception instanceof common_1.HttpException) {
            const statusCode = exception.getStatus();
            const { error, message } = this.parseHttpException(exception);
            const body = {
                statusCode,
                error,
                message,
                timestamp,
                path,
            };
            this.logHttpException(statusCode, req, exception, message);
            res.status(statusCode).json(body);
            return;
        }
        const err = exception instanceof Error ? exception : new Error(String(exception));
        const statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const body = {
            statusCode,
            error: "Internal Server Error",
            message: this.isProduction ? "Internal server error" : err.message,
            timestamp,
            path,
        };
        if (!this.isProduction && err.stack) {
            body.stack = err.stack;
        }
        this.logger.error(`${req.method} ${path} ${statusCode} — ${err.message}`, err.stack);
        res.status(statusCode).json(body);
    }
    parseHttpException(exception) {
        const statusCode = exception.getStatus();
        const raw = exception.getResponse();
        if (typeof raw === "string") {
            return {
                error: this.defaultErrorLabel(statusCode),
                message: raw,
            };
        }
        if (typeof raw === "object" && raw !== null) {
            const o = raw;
            const error = typeof o.error === "string" ? o.error : this.defaultErrorLabel(statusCode);
            let message;
            if (Array.isArray(o.message)) {
                message = o.message;
            }
            else if (typeof o.message === "string") {
                message = o.message;
            }
            else if (o.message !== undefined && typeof o.message === "object") {
                message = o.message;
            }
            else {
                message = exception.message;
            }
            return { error, message };
        }
        return {
            error: this.defaultErrorLabel(statusCode),
            message: exception.message,
        };
    }
    defaultErrorLabel(statusCode) {
        const key = common_1.HttpStatus[statusCode];
        if (typeof key === "string" && key.includes("_")) {
            return key
                .split("_")
                .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
                .join(" ");
        }
        return "Error";
    }
    logHttpException(statusCode, req, exception, message) {
        var _a, _b;
        const path = (_b = (_a = req.url) !== null && _a !== void 0 ? _a : req.originalUrl) !== null && _b !== void 0 ? _b : "";
        const summary = `${req.method} ${path} ${statusCode}`;
        const msgPreview = typeof message === "string"
            ? message
            : JSON.stringify(message).slice(0, 500);
        if (statusCode >= common_1.HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${summary} — ${msgPreview}`, exception.stack);
            return;
        }
        if (statusCode >= common_1.HttpStatus.BAD_REQUEST) {
            this.logger.warn(`${summary} — ${msgPreview}`);
        }
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [Boolean])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map