"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffle = void 0;
const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
};
exports.shuffle = shuffle;
//# sourceMappingURL=shuffle.js.map