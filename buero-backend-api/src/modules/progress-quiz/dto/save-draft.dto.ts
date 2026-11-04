import { ApiProperty } from "@nestjs/swagger";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { SubmitQuizAnswerItemDto } from "./submit-quiz.dto";

/**
 * What the student has typed into a test so far, kept so a closed tab does not take it.
 *
 * The same shape as a submission, and deliberately so: it is the same answers, just not
 * final. Nothing here is marked.
 */
export class SaveDraftDto {
  @ApiProperty({
    type: [SubmitQuizAnswerItemDto],
    example: [{ question_id: "2.T.1", answer: "a" }],
    description: "Усі відповіді, що є на цей момент. Замінюють збережені.",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitQuizAnswerItemDto)
  answers!: SubmitQuizAnswerItemDto[];
}
