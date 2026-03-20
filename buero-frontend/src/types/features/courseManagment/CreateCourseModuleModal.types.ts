export type CreateCourseModuleModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onCreateModule: (payload: { title: string }) => Promise<void>;
};

