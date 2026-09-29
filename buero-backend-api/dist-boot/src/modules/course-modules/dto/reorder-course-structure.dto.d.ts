export declare class ReorderStructureMaterialDto {
    id: string;
    order_index: number;
}
export declare class ReorderStructureModuleDto {
    id: string;
    order_index: number;
    materials?: ReorderStructureMaterialDto[];
}
export declare class ReorderCourseStructureDto {
    modules: ReorderStructureModuleDto[];
}
