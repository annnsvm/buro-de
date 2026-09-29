"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.Role = exports.ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("src/generated/prisma/enums");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return enums_1.Role; } });
exports.ROLES_KEY = "roles";
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map