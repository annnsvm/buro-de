import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVocabularyDto } from './create-vocabulary.dto';

/** The owning course is set when the word is added and is not editable afterwards. */
export class UpdateVocabularyDto extends PartialType(
  OmitType(CreateVocabularyDto, ['course_id'] as const),
) {}
