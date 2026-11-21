import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

/** Which lesson the student has just opened, so "continue" can send them back to it. */
export class OpenLessonDto {
  @ApiProperty({ format: "uuid", description: "Курс, у якому відкрито урок" })
  @IsUUID()
  course_id!: string;

  @ApiProperty({ format: "uuid", description: "Матеріал, який відкрито" })
  @IsUUID()
  course_material_id!: string;
}
