import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CourseSearchProps } from '@/types/features/courses-catalog/CourseSearch.types';
import Icon from '@/components/ui/Icon';
const DEBOUNCE_MS = 400;

const CourseSearch: React.FC<CourseSearchProps> = ({ onSearch, initialSearch = '' }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(initialSearch);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      e.currentTarget.blur(); 
    }
  };
  return (
    <div className="w-full">
      <div className="relative h-11">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[var(--color-text-secondary)]">
          <Icon name="icon-search" size={18} className="text-[var(--color-text-secondary)]" />
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={t('courses.searchPlaceholder')}
          className="h-full w-full rounded-full border border-[var(--color-border-default)] bg-[var(--color-neutral-white)] pr-4 pl-10 text-sm text-[var(--color-text-primary)] transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-border-strong)] focus:outline-none"
        />
      </div>
    </div>
  );
};

export default CourseSearch;
