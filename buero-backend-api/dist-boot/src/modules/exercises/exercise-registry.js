"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuestion = exports.describeAcceptedAnswers = exports.gradeAnswer = exports.supportedQuestionTypes = exports.getExerciseDefinition = void 0;
const choice_definitions_1 = require("./definitions/choice.definitions");
const ordering_definition_1 = require("./definitions/ordering.definition");
const written_definitions_1 = require("./definitions/written.definitions");
const DEFINITIONS = [
    choice_definitions_1.singleChoiceDefinition,
    choice_definitions_1.multiChoiceDefinition,
    written_definitions_1.fillBlankDefinition,
    written_definitions_1.textInputDefinition,
    ordering_definition_1.orderingDefinition,
];
const REGISTRY = new Map(DEFINITIONS.map((definition) => [definition.type, definition]));
const getExerciseDefinition = (type) => REGISTRY.get(type);
exports.getExerciseDefinition = getExerciseDefinition;
const supportedQuestionTypes = () => [...REGISTRY.keys()];
exports.supportedQuestionTypes = supportedQuestionTypes;
const gradeAnswer = (question, answer) => {
    const definition = REGISTRY.get(question.type);
    if (!definition)
        return { correct: false, quality: 'none' };
    return definition.grade(question, answer);
};
exports.gradeAnswer = gradeAnswer;
const describeAcceptedAnswers = (question) => {
    const definition = REGISTRY.get(question.type);
    return definition ? definition.describeAcceptedAnswers(question) : [];
};
exports.describeAcceptedAnswers = describeAcceptedAnswers;
const validateQuestion = (question) => {
    const definition = REGISTRY.get(question.type);
    if (!definition)
        return [`unsupported question type: ${question.type}`];
    return definition.validatePayload(question.payload, question.acceptedAnswers);
};
exports.validateQuestion = validateQuestion;
//# sourceMappingURL=exercise-registry.js.map