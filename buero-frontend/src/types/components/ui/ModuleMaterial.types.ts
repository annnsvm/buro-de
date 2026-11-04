import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type DragHandleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: (element: HTMLElement | null) => void;
};

type ModuleMaterialType = {
  id: string;
  type:
    | 'video'
    | 'vocabulary'
    | 'quiz'
    | 'grammar'
    | 'scenario'
    | 'cultural_insight'
    | 'homework'
    | 'text'
    | 'writing'
    | 'practice';
  title?: string;
  content?: Record<string, unknown>;
  /** Set on quiz materials: the practice after a lesson, or the test after a module. */
  quizMode?: 'practice' | 'test' | null;
  /** Percentage needed to pass, on a test. */
  passingScore?: number | null;
  /** On a practice: the lesson it hangs under in the list. */
  parentMaterialId?: string | null;
  /** Which blocks a practice contains. */
  blocks?: string[];
  /**
   * Null while the material is a draft, which only a teacher ever receives. A student's
   * course tree has no draft rows in it at all, so the field says nothing to them.
   */
  publishedAt?: string | null;
  orderIndex?: number;
};

type ModuleMaterialProps = {
  material: ModuleMaterialType;
  onSelectMaterial: (materialId: string) => void;
  onRequestDeleteMaterial?: (materialId: string) => void;
  /** Lets this one material out, with every block inside it. */
  onPublishMaterial?: (materialId: string) => void;
  isPublishingMaterial?: boolean;
  dragHandleProps?: DragHandleProps;
  isDragging?: boolean;
  sortableRef?: (element: HTMLElement | null) => void;
  sortableStyle?: CSSProperties;
};

type Modules = {
  id: string;
  title: string;
  materials: ModuleMaterialType[];
  orderIndex?: number;
};

type ModulesProps = {
  module: Modules;
  onCreateMaterial: (moduleId: string) => void;
  /**
   * Lets every draft of this module out at once. Absent when nothing is waiting, which is
   * also how the button knows not to draw itself.
   */
  onPublishModule?: (moduleId: string) => void;
  /** True while that request is in flight, so the button can say so. */
  isPublishingModule?: boolean;
  /**
   * Lets one material out, with every block inside it.
   *
   * A module is written unevenly - two practices finished and a third still half a
   * transcript - so "the whole module" is the wrong unit as often as it is the right one.
   */
  onPublishMaterial?: (moduleId: string, materialId: string) => void;
  /** The material whose publish is in flight, so only its own row says so. */
  publishingMaterialId?: string | null;
  /** Opens the CSV import for this module; absent when importing is not offered. */
  onImportQuestions?: (moduleId: string, moduleTitle: string) => void;
  onSelectMaterial: (moduleId: string, materialId: string) => void;
  onEditModule: (moduleId: string, moduleTitle: string) => void;
  onRequestDeleteModule?: (moduleId: string, moduleTitle: string) => void;
  onRequestDeleteMaterial?: (moduleId: string, materialId: string) => void;
  /** 1-based label position; falls back to orderIndex when omitted. */
  displayPosition?: number;
  dragHandleProps?: DragHandleProps;
  isDragging?: boolean;
  /** Keeps the module open while a material is dragged over it. */
  forceExpanded?: boolean;
  /** Registers the module body as a drop target for materials. */
  setDropTargetRef?: (element: HTMLElement | null) => void;
  /** Replaces the default material list, used to wrap rows in a sortable context. */
  renderMaterialsList?: () => ReactNode;
  sortableRef?: (element: HTMLElement | null) => void;
  sortableStyle?: CSSProperties;
};

type CourseProps = {
  id: string;
  titile: string;
  description: string;
  price: string;
  category: string;
  modules: Modules[];
};

export type {
  DragHandleProps,
  ModuleMaterialType,
  ModuleMaterialProps,
  CourseProps,
  Modules,
  ModulesProps,
};
