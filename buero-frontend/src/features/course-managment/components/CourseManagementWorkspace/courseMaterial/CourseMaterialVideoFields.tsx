import React from 'react';
import { FormField, Input } from '@/components/ui';
import type { CourseMaterialVideoFieldsProps } from '@/types/features/courseManagment/CourseMaterialVideoFields.types';

const CourseMaterialVideoFields: React.FC<CourseMaterialVideoFieldsProps> = ({
  youtubeVideoId,
  youtubeVideoDuration,
  isSubmitting,
  onYoutubeVideoIdChange,
  onYoutubeVideoDurationChange,
}) => (
  <>
    <FormField label="YouTube video id" name="youtubeVideoIdTab">
      <Input
        id="youtubeVideoIdTab"
        placeholder="e.g. dQw4w9WgXcQ"
        value={youtubeVideoId}
        onChange={(e) => onYoutubeVideoIdChange(e.target.value)}
        disabled={isSubmitting}
      />
    </FormField>
    <FormField label="Video duration" name="youtubeVideoDurationTab">
      <Input
        id="youtubeVideoDurationTab"
        placeholder="e.g. 10:45"
        value={youtubeVideoDuration}
        onChange={(e) => onYoutubeVideoDurationChange(e.target.value)}
        disabled={isSubmitting}
      />
    </FormField>
  </>
);

export default CourseMaterialVideoFields;
