"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrialModuleIds = exports.TRIAL_FREE_MODULE_COUNT = void 0;
exports.TRIAL_FREE_MODULE_COUNT = 2;
const getTrialModuleIds = async (prisma, courseId) => {
    const modules = await prisma.courseModule.findMany({
        where: { courseId },
        orderBy: { orderIndex: "asc" },
        take: exports.TRIAL_FREE_MODULE_COUNT,
        select: { id: true },
    });
    return modules.map((mod) => mod.id);
};
exports.getTrialModuleIds = getTrialModuleIds;
//# sourceMappingURL=trial-scope.js.map