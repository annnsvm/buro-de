"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const core_2 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = require("express");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
async function bootstrap() {
    var _a;
    const logger = new common_1.Logger("Bootstrap");
    const app = await core_2.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
    app.use((0, express_1.text)({ type: "text/plain" }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const reflector = app.get(core_1.Reflector);
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(reflector, {
        enableImplicitConversion: true,
    }));
    app.use((0, cookie_parser_1.default)());
    const configService = app.get(config_1.ConfigService);
    const isProduction = configService.get("NODE_ENV") === "production";
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(isProduction));
    const requiredEnv = [
        "DATABASE_URL",
        "JWT_ACCESS_SECRET",
        "JWT_REFRESH_SECRET",
        "WAYFORPAY_MERCHANT_ACCOUNT",
        "WAYFORPAY_MERCHANT_SECRET",
        "WAYFORPAY_MERCHANT_DOMAIN",
        "WAYFORPAY_SERVICE_URL",
        ...(isProduction ? ["CORS_ORIGIN"] : []),
    ];
    const optionalEnv = [
        "PORT",
        "NODE_ENV",
        "JWT_ACCESS_EXPIRES_IN",
        "JWT_REFRESH_EXPIRES_IN",
        "COOKIE_DOMAIN",
        "COOKIE_SECURE",
        ...(isProduction ? [] : ["CORS_ORIGIN"]),
        "WAYFORPAY_CURRENCY",
        "WAYFORPAY_RETURN_URL",
        "ANTHROPIC_API_KEY",
        "LLM_WRITING_MODEL",
        "LLM_WRITING_EFFORT",
        "LLM_WRITING_ATTEMPTS_PER_TASK",
        "LLM_WRITING_DAILY_LIMIT",
        "LLM_WRITING_MONTHLY_BUDGET_CHECKS",
    ];
    const missing = requiredEnv.filter((key) => !configService.get(key));
    if (missing.length) {
        logger.error(`Missing required env: ${missing.join(", ")}`);
        throw new Error(`Missing required env: ${missing.join(", ")}`);
    }
    requiredEnv.forEach((key) => logger.log(`Env ${key}: configured`));
    optionalEnv.forEach((key) => {
        const value = configService.get(key);
        logger.log(`Env ${key}: ${value != null && value !== "" ? "configured" : "default/empty"}`);
    });
    const port = (_a = configService.get("PORT")) !== null && _a !== void 0 ? _a : 3000;
    const corsOrigin = configService.get("CORS_ORIGIN");
    app.setGlobalPrefix("api");
    const DEV_CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];
    const allowedOrigins = corsOrigin
        ? corsOrigin.split(",").map((origin) => origin.trim()).filter(Boolean)
        : DEV_CORS_ORIGINS;
    logger.log(`CORS allowed origins: ${allowedOrigins.join(", ")}`);
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("Buero.de API")
        .setDescription("API платформи вивчення німецької мови")
        .setVersion("1.0")
        .addTag("auth", "Реєстрація, логін, refresh, logout")
        .addTag("users", "Профіль поточного користувача")
        .addTag("courses", "Курси: каталог (лише опубліковані), один курс по id (з модулями та матеріалами), CRUD для вчителів. Ієрархія Course → Module → Material.")
        .addTag("course-modules", "Модулі курсу: CRUD у контексті курсу")
        .addTag("course-materials", "Матеріали модуля: CRUD у контексті курсу та модуля")
        .addTag("subscriptions", "Купівля курсів через WayForPay та доступи")
        .addTag("payments", "Історія платежів")
        .addTag("health", "Перевірка стану сервера")
        .addTag("lesson-requests", "Запити на заняття: студент створює, вчитель приймає/відхиляє та виставляє статус після прийняття")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT", in: "header" }, "access_token")
        .addCookieAuth("access_token")
        .build();
    if (!isProduction) {
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup("api-docs", app, document);
    }
    await app.listen(port);
    logger.log(`Backend is running on http://localhost:${port}`);
    if (!isProduction) {
        logger.log(`Swagger docs: http://localhost:${port}/api-docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map