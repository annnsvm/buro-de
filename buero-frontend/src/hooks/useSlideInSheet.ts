import { useEffect, useLayoutEffect, useState } from 'react';

export const useSlideInSheet = (isOpen: boolean, durationMs = 300) => {
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);

  useLayoutEffect(() => {
    if (!isOpen) {
      setEntered(false);
      const t = window.setTimeout(() => setMounted(false), durationMs);
      return () => clearTimeout(t);
    }
    setMounted(true);
    setEntered(false);
  }, [isOpen, durationMs]);

  useEffect(() => {
    if (!isOpen || !mounted) return;
    const id = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen, mounted]);

  return { mounted, entered };
};
