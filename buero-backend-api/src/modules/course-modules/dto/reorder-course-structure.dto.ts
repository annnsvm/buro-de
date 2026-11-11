import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsOptional,
  IsUUID,
  Min,
  ValidateIf,
  ValidateNested,
} from "class-validator";

export class ReorderStructureMaterialDto {
  @ApiProperty({ format: "uuid", description: "Material id" })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 0,
    description: "Position inside the target module (0 = first)",
  })
  @IsInt()
  @Min(0)
  order_index!: number;

  /**
   * The lesson a practice hangs under, or null for a row that stands on its own.
   *
   * It travels with the order because a practice is placed in the list by its lesson rather
   * than by its position, so dragging one between lessons has nothing else to carry the
   * change. Omitted leaves the material where it is.
   */
  @ApiPropertyOptional({
    format: "uuid",
    nullable: true,
    description:
      "Lesson this practice hangs under; null detaches it. Omit to leave it unchanged.",
  })
  @IsOptional()
  @ValidateIf((o: ReorderStructureMaterialDto) => o.parent_material_id !== null)
  @IsUUID()
  parent_material_id?: string | null;
}

export class ReorderStructureModuleDto {
  @ApiProperty({ format: "uuid", description: "Module id" })
  @IsUUID()
  id!: string;

  @ApiProperty({
    example: 0,
    description: "Position inside the course (0 = first)",
  })
  @IsInt()
  @Min(0)
  order_index!: number;

  @ApiPropertyOptional({
    type: [ReorderStructureMaterialDto],
    description:
      "Materials that belong to this module after the move, in display order. Omit to leave the module content untouched.",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderStructureMaterialDto)
  materials?: ReorderStructureMaterialDto[];
}

export class ReorderCourseStructureDto {
  @ApiProperty({
    type: [ReorderStructureModuleDto],
    description: "Full course structure in display order",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderStructureModuleDto)
  modules!: ReorderStructureModuleDto[];
}
