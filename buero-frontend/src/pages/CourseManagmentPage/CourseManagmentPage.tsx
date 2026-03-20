import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { API_ENDPOINTS } from '@/api/apiEndpoints';
import { apiInstance } from '@/api/apiInstance';
import { Container, Section, Text, Title } from '@/components/layout';
import type { Modules } from '@/types/components/ui/ModuleMaterial.types';
import CourseStructureAside from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseStructureAside';
import CourseCoverSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseCoverSection';
import CourseDetailsSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseDetailsSection';
import CourseTagsSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseTagsSection';
import CoursePriceSection from '@/features/course-managment/components/CourseManagementWorkspace/parts/CoursePriceSection';
import type { CurrencySymbol } from '@/types/features/courseManagment/CoursePricing.types';
import CourseCreateActions from '@/features/course-managment/components/CourseManagementWorkspace/parts/CourseCreateActions';
import CreateCourseModuleModal from '@/features/course-managment/components/CreateCourseModuleModal/CreateCourseModuleModal';
import {
  createCourseSchema,
  type CreateCourseFormValues,
} from '@/features/course-managment/validation/createCourseSchema';

const CourseManagmentPage: React.FC = () => {
  const [modules, setModules] = useState<Modules[]>([]);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      title: '',
      description: '',
      language: 'en',
      category: 'language',
      price: '',
      tags: [],
      level: '',
    },
  });

  const watchedTitle = watch('title') ?? '';
  const watchedDescription = watch('description') ?? '';
  const watchedTags = watch('tags') ?? [];
  const watchedPrice = watch('price') ?? '';
  const watchedLevel = watch('level') ?? '';

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [priceCurrencySymbol, setPriceCurrencySymbol] = useState<CurrencySymbol>('€');

  const [courseId, setCourseId] = useState<string | null>(null);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isUpdatingCourse, setIsUpdatingCourse] = useState(false);
  const [createCourseError, setCreateCourseError] = useState<string | null>(null);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);

  const fetchCourseTree = useCallback(
    async (id: string) => {
      const res = await apiInstance.get<{ modules?: Modules[] }>(API_ENDPOINTS.courses.byId(id));
      setModules(res.data.modules ?? []);
    },
    [],
  );

  const isFormDisabled = courseId !== null && !isEditingCourse;

  const canCreate = !courseId && !isCreatingCourse && !isUpdatingCourse;
  const canUpdate = !!courseId && isEditingCourse && !isCreatingCourse && !isUpdatingCourse && isDirty && isValid;

  const handleCreateCourseSubmit = async (values: CreateCourseFormValues) => {
    setCreateCourseError(null);
    setIsCreatingCourse(true);

    try {
      const payload: Record<string, unknown> = {
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        language: values.language,
        category: values.category,
        is_published: false,
        tags: values.tags,
        price: Number(values.price.trim()),
        level: values.level,
      };

      const res = await apiInstance.post<{ id: string }>(API_ENDPOINTS.courses.create, payload);
      setCourseId(res.data.id);
      setIsEditingCourse(false);
      setCreateCourseError(null);
      reset(values);
      await fetchCourseTree(res.data.id);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : 'Failed to create course';
      setCreateCourseError(Array.isArray(message) ? message.join(', ') : String(message));
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleUpdateCourseSubmit = async (values: CreateCourseFormValues) => {
    if (!courseId) return;

    setCreateCourseError(null);
    setIsUpdatingCourse(true);

    try {
      const payload: Record<string, unknown> = {
        title: values.title.trim(),
        description: values.description?.trim() ?? '',
        language: values.language,
        category: values.category,
        tags: values.tags,
        price: Number(values.price.trim()),
        level: values.level,
      };

      await apiInstance.patch(API_ENDPOINTS.courses.update(courseId), payload);
      reset(values);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : 'Failed to update course';
      setCreateCourseError(Array.isArray(message) ? message.join(', ') : String(message));
    } finally {
      setIsUpdatingCourse(false);
    }
  };

  const handleFormSubmit = async (values: CreateCourseFormValues) => {
    if (!courseId) return handleCreateCourseSubmit(values);
    if (!isEditingCourse) return;
    return handleUpdateCourseSubmit(values);
  };

  return (
    <div>
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-surface-section)]">
        <CourseStructureAside
          modules={modules}
          courseId={courseId}
          courseTitle={watchedTitle}
          onSelectCourse={() => {
            if (isEditingCourse) return;
            setIsEditingCourse(true);
          }}
          onCreateModule={() => {
            if (!courseId) return;
            setIsCreateModuleOpen(true);
          }}
        />

        <div className="py-8 min-w-0 flex-1 overflow-y-auto">
          <header className="shrink-0">
            <Container className="px-4 sm:px-6">
              <div className="flex w-full flex-col items-center gap-2 text-[var(--color-neutral-darkest)]">
                <Title className="text-center text-[2rem] sm:text-[3rem] lg:text-[3.75rem]">
                  {watchedTitle.trim() ? watchedTitle.trim() : 'New course'}
                </Title>
                <Text
                  className="text-center text-[0.9rem] sm:text-[0.9rem] lg:text-[1.25rem]"
                  label="create course text"
                >
                  {watchedDescription.trim()
                    ? watchedDescription.trim()
                    : 'Add a description to help students understand what they will learn.'}
                </Text>
              </div>
            </Container>
          </header>
          <Section className="py-8">
            <Container className="max-w-[1100px] px-4 sm:px-6">
              <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
                <CourseCoverSection
                  coverPreviewUrl={coverPreviewUrl}
                  disabled={isFormDisabled}
                  onPick={(file, previewUrl) => {
                    setCoverFile(file);
                    setCoverPreviewUrl(previewUrl);
                  }}
                  onClear={() => {
                    setCoverFile(null);
                    setCoverPreviewUrl(null);
                  }}
                />

                <CourseDetailsSection
                  courseName={watchedTitle}
                  courseDescription={watchedDescription}
                  level={watchedLevel}
                  nameError={errors.title?.message}
                  descriptionError={errors.description?.message}
                  levelError={errors.level?.message}
                  disabled={isFormDisabled}
                  onChangeName={(value) => setValue('title', value, { shouldDirty: true, shouldValidate: true })}
                  onChangeDescription={(value) =>
                    setValue('description', value, { shouldDirty: true, shouldValidate: true })
                  }
                  onChangeLevel={(value) => setValue('level', value, { shouldDirty: true, shouldValidate: true })}
                />

                <CourseTagsSection
                  tags={watchedTags}
                  disabled={isFormDisabled}
                  onChangeTags={(next) => setValue('tags', next, { shouldDirty: true, shouldValidate: true })}
                  error={errors.tags?.message}
                />

                <CoursePriceSection
                  amount={watchedPrice}
                  currencySymbol={priceCurrencySymbol}
                  error={errors.price?.message}
                  disabled={isFormDisabled}
                  onChangeAmount={(value) => setValue('price', value, { shouldDirty: true, shouldValidate: true })}
                  onChangeCurrencySymbol={setPriceCurrencySymbol}
                />

                <CourseCreateActions
                  isCreating={isCreatingCourse}
                  error={createCourseError}
                  mode={courseId ? 'edit' : 'create'}
                  canCreate={canCreate}
                  canUpdate={canUpdate}
                  isUpdating={isUpdatingCourse}
                  onCreateCourse={handleSubmit(handleCreateCourseSubmit)}
                  onUpdateCourse={handleSubmit(handleUpdateCourseSubmit)}
                />

                <input type="hidden" value={coverFile ? coverFile.name : ''} readOnly />
              </form>
            </Container>
          </Section>
        </div>
      </div>

      <CreateCourseModuleModal
        isOpen={isCreateModuleOpen}
        handleOpenChange={(open) => {
          if (!open) setIsCreateModuleOpen(false);
          else setIsCreateModuleOpen(open);
        }}
        onCreateModule={async ({ title }) => {
          if (!courseId) return;
          const currentOrders = modules.map((m) => m.orderIndex ?? 0);
          const nextOrderIndex = currentOrders.length ? Math.max(...currentOrders) + 1 : 0;
          await apiInstance.post(API_ENDPOINTS.courseModules.create(courseId), {
            title,
            order_index: nextOrderIndex,
          });
          await fetchCourseTree(courseId);
        }}
      />
    </div>
  );
};

export default CourseManagmentPage;
