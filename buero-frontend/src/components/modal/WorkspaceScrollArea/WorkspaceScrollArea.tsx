import React, { forwardRef } from 'react';
import type SimpleBarCore from 'simplebar-core';
import SimpleBar from 'simplebar-react';

export type WorkspaceScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * SimpleBar для робочих панелей (курс, редактор): той самий стиль «пальця», що й у модалках,
 * трек на всю висоту без відступу під кнопку закриття.
 */
const WorkspaceScrollArea = forwardRef<SimpleBarCore | null, WorkspaceScrollAreaProps>(
  ({ children, className = '' }, ref) => {
    const rootClass = ['simplebar-buero-panel', 'min-h-0 min-w-0', className].filter(Boolean).join(' ');

    return (
      <SimpleBar ref={ref} className={rootClass}>
        {children}
      </SimpleBar>
    );
  },
);

WorkspaceScrollArea.displayName = 'WorkspaceScrollArea';

export default WorkspaceScrollArea;
