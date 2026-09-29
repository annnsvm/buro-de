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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const enums_1 = require("src/generated/prisma/enums");
const quiz_service_1 = require("./quiz.service");
const create_attempt_dto_1 = require("./dto/create-attempt.dto");
const answer_question_dto_1 = require("./dto/answer-question.dto");
const submit_quiz_dto_1 = require("./dto/submit-quiz.dto");
const attempt_response_dto_1 = require("./dto/attempt-response.dto");
const submit_quiz_response_dto_1 = require("./dto/submit-quiz-response.dto");
let QuizController = class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    getQuestions(user, materialId, block) {
        return this.quizService.getQuestions(materialId, user.id, user.role, block);
    }
    getLastAttempt(user, materialId) {
        return this.quizService.getLastAttempt(materialId, user.id, user.role);
    }
    startAttempt(user, dto) {
        return this.quizService.startAttempt(user.id, user.role, dto.course_material_id);
    }
    getAttempt(userId, attemptId) {
        return this.quizService.getAttempt(attemptId, userId);
    }
    answerQuestion(userId, attemptId, body) {
        return this.quizService.answerQuestion(attemptId, userId, body);
    }
    submitQuiz(userId, attemptId, body) {
        return this.quizService.submitQuiz(attemptId, userId, body);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Get)("materials/:materialId/questions"),
    (0, swagger_1.ApiOperation)({
        summary: "Питання квізу",
        description: "Питання матеріалу в тому вигляді, в якому їх бачить студент: id, тип, текст, варіанти або слова для впорядкування. " +
            "Правильні відповіді та пояснення не повертаються — пояснення приходить у відповіді на submit, після того як студент відповів.",
    }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "UUID матеріалу типу quiz" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Масив питань" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Матеріал не є квізом" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Немає доступу до модуля" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Матеріал не знайдено" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("materialId")),
    __param(2, (0, common_1.Query)("block")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "getQuestions", null);
__decorate([
    (0, common_1.Get)("materials/:materialId/last-attempt"),
    (0, swagger_1.ApiOperation)({
        summary: "Остання завершена спроба",
        description: "Результат останньої завершеної спроби цього квізу разом із відповідями студента, поясненнями та правильними відповідями. " +
            "null, якщо студент ще не проходив квіз. Дозволяє повернутись до квізу і побачити свій результат, а не порожню форму.",
    }),
    (0, swagger_1.ApiParam)({ name: "materialId", description: "UUID матеріалу типу quiz" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Остання спроба або null" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Немає доступу до модуля" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Матеріал не знайдено" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("materialId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "getLastAttempt", null);
__decorate([
    (0, common_1.Post)("attempts"),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: "Почати спробу квізу",
        description: "Створює новий запис у quiz_attempts (без completed_at). Перевірка: матеріал типу quiz, користувач має доступ до курсу (підписка/trial). Тільки для студентів.",
    }),
    (0, swagger_1.ApiBody)({ type: create_attempt_dto_1.CreateAttemptDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Спроба створена",
        type: attempt_response_dto_1.AttemptResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для студентів" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Матеріал не знайдено" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Матеріал не є квізом" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Немає доступу до курсу" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_attempt_dto_1.CreateAttemptDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.Get)("attempts/:attemptId"),
    (0, swagger_1.ApiOperation)({
        summary: "Стан спроби (resume)",
        description: "Поточний стан спроби квізу: attempt, answers_snapshot, completed_at, score. Для продовження квізу. 404, якщо спроба не знайдена або не належить користувачу. Тільки для студентів.",
    }),
    (0, swagger_1.ApiParam)({ name: "attemptId", description: "UUID спроби" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Спроба", type: attempt_response_dto_1.AttemptResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для студентів" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Спроба не знайдена" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Param)("attemptId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "getAttempt", null);
__decorate([
    (0, common_1.Post)("attempts/:attemptId/answers"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Відповісти на одне питання",
        description: "Перевіряє одну відповідь одразу після того, як студент її дав, і повертає результат разом із поясненням та правильною відповіддю саме на це питання. " +
            "На кожне питання можна відповісти лише раз за спробу. Коли відповіді дано на всі питання, спроба завершується сама і у відповіді приходить summary.",
    }),
    (0, swagger_1.ApiParam)({ name: "attemptId", description: "UUID спроби" }),
    (0, swagger_1.ApiBody)({ type: answer_question_dto_1.AnswerQuestionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Відповідь перевірено" }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Спробу завершено або на питання вже відповіли" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Спробу або питання не знайдено" }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Param)("attemptId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, answer_question_dto_1.AnswerQuestionDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "answerQuestion", null);
__decorate([
    (0, common_1.Post)("attempts/:attemptId/submit"),
    (0, swagger_1.ApiOperation)({
        summary: "Відправити всі відповіді квізу та завершити спробу",
        description: "Приймає масив усіх відповідей, перевіряє по content матеріалу, зберігає в quiz_attempts, рахує score, завершує спробу та оновлює course_progress. Повертає attempt, score, total, correct, results (по кожному питанню). 400 — невалідний block_index/question_id або спроба вже завершена.",
    }),
    (0, swagger_1.ApiParam)({ name: "attemptId", description: "UUID спроби" }),
    (0, swagger_1.ApiBody)({ type: submit_quiz_dto_1.SubmitQuizDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Результат квізу",
        type: submit_quiz_response_dto_1.SubmitQuizResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Не авторизовано" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Тільки для студентів" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Спроба не знайдена" }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Невірні відповіді або спроба вже завершена",
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)("id")),
    __param(1, (0, common_1.Param)("attemptId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, submit_quiz_dto_1.SubmitQuizDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "submitQuiz", null);
exports.QuizController = QuizController = __decorate([
    (0, swagger_1.ApiTags)("quiz"),
    (0, common_1.Controller)("quiz"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(enums_1.Role.student),
    (0, swagger_1.ApiBearerAuth)("access_token"),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map