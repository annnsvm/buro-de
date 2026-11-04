import { beforeAll, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CourseModule from '@/components/ui/CourseStructure/CourseModule/CourseModule';
import type { ModuleMaterialType } from '@/types/components/ui/ModuleMaterial.types';
import { i18nReady } from '@/i18n';
import { renderWithProviders } from '../../../utils/renderWithProviders';

/**
 * What the teacher sees between uploading a CSV and letting it out.
 *
 * The questions an import brings in were always drafts, but the materials around them were
 * not - so uploading eight practices put eight empty practices into every student's lesson
 * list at once. An empty practice is worse than a missing one: it reads as the course being
 * broken rather than as a course still being written.
 *
 * So the material waits with its contents, and the module is released as one act. These are
 * the two things that make that state legible: which rows are waiting, and the one button
 * that ends the waiting.
 */
beforeAll(async () => {
  await i18nReady;
});

const material = (
  id: string,
  publishedAt: string | null,
  over: Partial<ModuleMaterialType> = {},
): ModuleMaterialType => ({
  id,
  type: 'practice',
  title: `Практика ${id}`,
  content: {},
  publishedAt,
  ...over,
});

const draw = (materials: ModuleMaterialType[], over: Record<string, unknown> = {}) =>
  renderWithProviders(
    <ul>
      <CourseModule
        module={{ id: 'mod-1', title: 'Модуль 2', materials, orderIndex: 2 }}
        onCreateMaterial={vi.fn()}
        onSelectMaterial={vi.fn()}
        onEditModule={vi.fn()}
        forceExpanded
        {...over}
      />
    </ul>,
  );

describe('a module with freshly imported materials', () => {
  it('marks every row a student cannot see yet', async () => {
    draw([material('a', null), material('b', null), material('c', '2026-10-01T00:00:00Z')]);

    expect(await screen.findAllByText('чернетка')).toHaveLength(2);
  });

  it('says how many are waiting, and offers the one button that releases them', async () => {
    const onPublishModule = vi.fn();
    draw([material('a', null), material('b', null)], { onPublishModule });

    expect(await screen.findByText(/Чернеток: 2/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Опублікувати модуль' }));
    expect(onPublishModule).toHaveBeenCalledWith('mod-1');
  });

  /**
   * A finished module carries no button asking to be pressed. Editing something already
   * published needs none of this - a correction reaches the student at once.
   */
  it('offers nothing when every material is already out', async () => {
    draw([material('a', '2026-10-01T00:00:00Z')], { onPublishModule: vi.fn() });

    expect(screen.queryByText('чернетка')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Опублікувати модуль' }),
    ).not.toBeInTheDocument();
  });

  it('says it is working, and cannot be pressed twice', async () => {
    const onPublishModule = vi.fn();
    draw([material('a', null)], { onPublishModule, isPublishingModule: true });

    const button = await screen.findByRole('button', { name: 'Публікуємо…' });
    expect(button).toBeDisabled();
    expect(onPublishModule).not.toHaveBeenCalled();
  });

  /**
   * A student's tree carries no draft rows at all, so the field is absent rather than null.
   * Absent must not read as "draft" - every lesson of a finished course would be badged.
   */
  it('says nothing about drafts when the field is absent, as on a student tree', async () => {
    const withoutField = { id: 'a', type: 'video' as const, title: 'Урок 1', content: {} };
    draw([withoutField], { onPublishModule: vi.fn() });

    expect(screen.queryByText('чернетка')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Опублікувати модуль' }),
    ).not.toBeInTheDocument();
  });
});

/**
 * Releasing one practice at a time.
 *
 * A module is written unevenly: two practices finished and a third still half a transcript.
 * Between "one block" and "the whole module" there was nothing, so the only way to show the
 * finished work was to show the unfinished with it.
 */
describe('publishing one material on its own', () => {
  it('offers the row button only on a draft', async () => {
    const onPublishMaterial = vi.fn();
    draw([material('a', null), material('b', '2026-10-01T00:00:00Z')], {
      onPublishMaterial,
    });

    const buttons = await screen.findAllByRole('button', {
      name: /^Опублікувати Практика/,
    });
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAccessibleName('Опублікувати Практика a');
  });

  it('publishes that material and nothing else', async () => {
    const onPublishMaterial = vi.fn();
    draw([material('a', null), material('b', null)], { onPublishMaterial });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Опублікувати Практика b' }),
    );

    expect(onPublishMaterial).toHaveBeenCalledTimes(1);
    /** The module id travels with it, because that is what the API path needs. */
    expect(onPublishMaterial).toHaveBeenCalledWith('mod-1', 'b');
  });

  it('cannot be pressed twice while it is working', async () => {
    const onPublishMaterial = vi.fn();
    draw([material('a', null)], { onPublishMaterial, publishingMaterialId: 'a' });

    expect(
      await screen.findByRole('button', { name: 'Опублікувати Практика a' }),
    ).toBeDisabled();
  });

  /** Selecting the material must not be what the publish press does. */
  it('does not open the material it publishes', async () => {
    const onSelectMaterial = vi.fn();
    draw([material('a', null)], { onPublishMaterial: vi.fn(), onSelectMaterial });

    await userEvent.click(
      await screen.findByRole('button', { name: 'Опублікувати Практика a' }),
    );

    expect(onSelectMaterial).not.toHaveBeenCalled();
  });

  it('says that finished work can go out on its own', async () => {
    draw([material('a', null)], {
      onPublishModule: vi.fn(),
      onPublishMaterial: vi.fn(),
    });

    expect(await screen.findByText(/кнопкою в рядку матеріалу/)).toBeInTheDocument();
  });
});
