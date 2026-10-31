import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * State that survives the component being unmounted.
 *
 * Everything a person types here used to live in `useState` alone, which is destroyed the moment
 * the component goes away. Leaving a practice block, switching to another block in the editor or
 * closing a modal therefore threw away work that had never been sent anywhere - a letter refused
 * for being too short was gone by the time the student came back to lengthen it.
 *
 * The draft is kept per browser profile, not per account: it never leaves the device, so it is
 * not a sync mechanism and must not be relied on as one. Callers put whatever identifies the
 * person into the key, so two people sharing a browser do not inherit each other's text.
 *
 * Every read and write is wrapped. Storage throws in a private window, and comes back empty when
 * site data is cleared, so a draft that cannot be stored degrades to ordinary state rather than
 * breaking the screen it was meant to protect.
 */

const PREFIX = 'buero:draft:';

/** Long enough to survive a few days away, short enough not to hoard abandoned text. */
const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

/** Typing writes at most this often; the latest value is flushed on unmount regardless. */
const WRITE_DELAY_MS = 500;

type Stored<T> = { at: number; value: T };

/**
 * Nothing worth keeping. An untouched form would otherwise store its own initial value on the
 * way out, and a cleared draft would be written straight back.
 */
const isEmpty = (value: unknown): boolean =>
  value === null || value === undefined || value === '';

const read = <T,>(key: string): T | undefined => {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Stored<T>;
    if (typeof parsed?.at !== 'number') return undefined;
    /** Abandoned long ago: drop it rather than restoring text its author has forgotten. */
    if (Date.now() - parsed.at > MAX_AGE_MS) {
      window.localStorage.removeItem(PREFIX + key);
      return undefined;
    }
    return parsed.value;
  } catch {
    return undefined;
  }
};

const write = <T,>(key: string, value: T): void => {
  try {
    if (isEmpty(value)) {
      window.localStorage.removeItem(PREFIX + key);
      return;
    }
    const stored: Stored<T> = { at: Date.now(), value };
    window.localStorage.setItem(PREFIX + key, JSON.stringify(stored));
  } catch {
    /* A full or blocked store costs the draft, never the screen. */
  }
};

const forget = (key: string): void => {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* Nothing to do: the draft is already unreachable. */
  }
};

export type PersistentDraft<T> = {
  value: T;
  setValue: React.Dispatch<React.SetStateAction<T>>;
  /** Forget the stored draft. Call it once the work has actually been saved or sent. */
  clear: () => void;
  /** True when this mount started from a stored draft rather than from the initial value. */
  restored: boolean;
};

export const usePersistentDraft = <T,>(
  /** Stable and unique per piece of work. `null` turns persistence off entirely. */
  key: string | null,
  initial: T,
): PersistentDraft<T> => {
  const stored = useRef<T | undefined>(key ? read<T>(key) : undefined);
  const [value, setValueRaw] = useState<T>(
    stored.current !== undefined ? stored.current : initial,
  );
  const [restored, setRestored] = useState(
    stored.current !== undefined && !isEmpty(stored.current),
  );

  /**
   * Whether anything has actually been typed.
   *
   * Without this the hook stores its own initial value on the way out, so a form nobody touched
   * leaves a draft behind - and the next visit announces that text was restored when none ever
   * was. A draft loaded from storage counts as touched: it is already worth keeping.
   */
  const touched = useRef(stored.current !== undefined);

  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>((next) => {
    touched.current = true;
    setValueRaw(next);
  }, []);

  /** The newest value, so the unmount flush writes what was typed and not a stale copy. */
  const latest = useRef(value);
  latest.current = value;

  /**
   * A changed key is a different piece of work, so the draft for the new one is loaded. Without
   * this the previous task's text would follow the student to the next one.
   */
  const previousKey = useRef(key);
  useEffect(() => {
    if (previousKey.current === key) return;
    previousKey.current = key;
    const next = key ? read<T>(key) : undefined;
    /** Raw, so loading another task's draft is not mistaken for the author typing. */
    setValueRaw(next !== undefined ? next : initial);
    setRestored(next !== undefined && !isEmpty(next));
    touched.current = next !== undefined;
    // `initial` is deliberately not a dependency: it is the fallback, not a value to follow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  /** Periodic save while typing, so a crash or a closed tab is not a total loss. */
  useEffect(() => {
    if (!key || !touched.current) return;
    const id = window.setTimeout(() => write(key, value), WRITE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [key, value]);

  /**
   * The save that matters.
   *
   * Clearing the pending timeout on unmount would drop the last keystrokes - exactly the loss
   * this hook exists to prevent - so what is current is written as the component goes away.
   */
  useEffect(() => {
    if (!key) return;
    return () => {
      if (touched.current) write(key, latest.current);
    };
  }, [key]);

  const clear = useCallback(() => {
    if (key) forget(key);
    setRestored(false);
    /** Nothing left to protect, so the unmount flush must not write it straight back. */
    touched.current = false;
  }, [key]);

  return { value, setValue, clear, restored };
};
