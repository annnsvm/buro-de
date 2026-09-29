"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalSet = exports.asStringArray = void 0;
const asStringArray = (value) => Array.isArray(value) ? value.map(String) : [String(value)];
exports.asStringArray = asStringArray;
const canonicalSet = (value) => (0, exports.asStringArray)(value)
    .map((item) => item.trim())
    .filter(Boolean)
    .sort()
    .join(',');
exports.canonicalSet = canonicalSet;
//# sourceMappingURL=exercise.types.js.map