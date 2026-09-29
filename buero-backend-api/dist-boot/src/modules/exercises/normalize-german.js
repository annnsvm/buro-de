"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchGermanAnswer = void 0;
const foldUmlauts = (value) => value
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue');
const tidy = (value) => value.trim().replace(/\s+/g, ' ');
const canonical = (value) => foldUmlauts(tidy(value));
const withoutPunctuation = (value) => tidy(value.replace(/[,;]/g, ' ').replace(/[.!?]+$/, ''));
const matchGermanAnswer = (answer, acceptedAnswers) => {
    const given = canonical(answer);
    if (!given)
        return { correct: false, quality: 'none', matched: null };
    const givenPlain = withoutPunctuation(given);
    let punctuationMatch = null;
    let caseMatch = null;
    for (const accepted of acceptedAnswers) {
        const expected = canonical(accepted);
        if (!expected)
            continue;
        if (given === expected) {
            return { correct: true, quality: 'exact', matched: accepted };
        }
        const expectedPlain = withoutPunctuation(expected);
        if (givenPlain === expectedPlain) {
            punctuationMatch !== null && punctuationMatch !== void 0 ? punctuationMatch : (punctuationMatch = accepted);
            continue;
        }
        if (givenPlain.toLowerCase() === expectedPlain.toLowerCase()) {
            caseMatch !== null && caseMatch !== void 0 ? caseMatch : (caseMatch = accepted);
        }
    }
    if (caseMatch)
        return { correct: true, quality: 'case', matched: caseMatch };
    if (punctuationMatch) {
        return { correct: true, quality: 'punctuation', matched: punctuationMatch };
    }
    return { correct: false, quality: 'none', matched: null };
};
exports.matchGermanAnswer = matchGermanAnswer;
//# sourceMappingURL=normalize-german.js.map