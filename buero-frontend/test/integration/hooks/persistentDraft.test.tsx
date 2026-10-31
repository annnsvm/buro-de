import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { usePersistentDraft } from '@/hooks/usePersistentDraft';

/**
 * Typed text that survives the component being unmounted.
 *
 * Both halves of the product lost work the same way: a student whose letter was refused left the
 * block and came back to an empty box, and a teacher who switched blocks in the editor lost the
 * task they had been typing. Neither had been sent anywhere, so nothing could bring it back.
 */

/** A box that goes away and comes back, which is the whole situation being tested. */
const Box: React.FC<{ draftKey: string | null; initial?: string }> = ({
  draftKey,
  initial = '',
}) => {
  const { value, setValue, clear, restored } = usePersistentDraft<string>(draftKey, initial);
  return (
    <div>
      <textarea aria-label="text" value={value} onChange={(e) => setValue(e.target.value)} />
      {restored ? <span>restored</span> : null}
      <button type="button" onClick={clear}>
        clear
      </button>
    </div>
  );
};

const Mountable: React.FC<{ draftKey: string; initial?: string }> = ({ draftKey, initial }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)}>
        toggle
      </button>
      {open ? <Box draftKey={draftKey} initial={initial} /> : null}
    </div>
  );
};

/**
 * A working `localStorage`, because this environment does not have one.
 *
 * Under jsdom here `window.localStorage` is a bare object with no methods at all, so every call
 * the hook makes throws a TypeError. That is caught and the hook degrades to ordinary state,
 * which is the right behaviour and is asserted at the end of this file - but it also means a
 * draft cannot be observed without putting a real store in place first.
 */
const installStorage = () => {
  const data = new Map<string, string>();
  const store = {
    getItem: (k: string) => (data.has(k) ? (data.get(k) as string) : null),
    setItem: (k: string, v: string) => void data.set(k, String(v)),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
    key: (i: number) => [...data.keys()][i] ?? null,
    get length() {
      return data.size;
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: store,
    configurable: true,
    writable: true,
  });
};

installStorage();

beforeEach(() => window.localStorage.clear());
afterEach(() => window.localStorage.clear());

describe('a draft that outlives its component', () => {
  it('brings the text back after the component is unmounted and mounted again', async () => {
    const user = userEvent.setup();
    render(<Mountable draftKey="letter-1" />);

    await user.type(screen.getByLabelText('text'), 'Sehr geehrte Frau Schmidt');
    /** Leaving the screen, which is what used to throw the text away. */
    await user.click(screen.getByText('toggle'));
    expect(screen.queryByLabelText('text')).toBeNull();

    await user.click(screen.getByText('toggle'));
    expect(screen.getByLabelText('text')).toHaveValue('Sehr geehrte Frau Schmidt');
  });

  /**
   * The flush on unmount is the point. A debounce that only saved on a timer would drop whatever
   * was typed in the last moment before leaving, which is exactly when a person gives up and
   * navigates away.
   */
  it('keeps the last keystrokes, not only what a timer had saved', async () => {
    const user = userEvent.setup();
    render(<Mountable draftKey="letter-2" />);

    await user.type(screen.getByLabelText('text'), 'abc');
    await user.click(screen.getByText('toggle'));

    const raw = window.localStorage.getItem('buero:draft:letter-2');
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string).value).toBe('abc');
  });

  it('says so when the text was restored rather than typed', async () => {
    const user = userEvent.setup();
    render(<Mountable draftKey="letter-3" />);

    await user.type(screen.getByLabelText('text'), 'etwas');
    expect(screen.queryByText('restored')).toBeNull();

    await user.click(screen.getByText('toggle'));
    await user.click(screen.getByText('toggle'));
    expect(screen.getByText('restored')).toBeInTheDocument();
  });

  it('forgets the draft once the work has been saved', async () => {
    const user = userEvent.setup();
    render(<Mountable draftKey="letter-4" />);

    await user.type(screen.getByLabelText('text'), 'fertig');
    await user.click(screen.getByText('clear'));
    await user.click(screen.getByText('toggle'));
    await user.click(screen.getByText('toggle'));

    expect(screen.getByLabelText('text')).toHaveValue('');
    expect(window.localStorage.getItem('buero:draft:letter-4')).toBeNull();
  });

  /** A different task is a different draft: the previous one must not follow the student. */
  it('swaps drafts when the key changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Box draftKey="task-a" />);

    await user.type(screen.getByLabelText('text'), 'erste Aufgabe');
    rerender(<Box draftKey="task-b" />);
    expect(screen.getByLabelText('text')).toHaveValue('');

    await user.type(screen.getByLabelText('text'), 'zweite Aufgabe');
    rerender(<Box draftKey="task-a" />);
    expect(screen.getByLabelText('text')).toHaveValue('erste Aufgabe');
  });

  it('falls back to the initial value when there is no draft', () => {
    render(<Box draftKey="task-c" initial="aus der Datenbank" />);
    expect(screen.getByLabelText('text')).toHaveValue('aus der Datenbank');
    expect(screen.queryByText('restored')).toBeNull();
  });

  /** An untouched form must not leave its own initial value behind as if it were typed. */
  it('stores nothing for a form nobody touched', async () => {
    const user = userEvent.setup();
    render(<Mountable draftKey="task-d" initial="eine Vorgabe" />);

    await user.click(screen.getByText('toggle'));
    expect(window.localStorage.getItem('buero:draft:task-d')).toBeNull();
  });

  it('keeps nothing at all when no key is given', async () => {
    const user = userEvent.setup();
    render(<Box draftKey={null} />);

    await user.type(screen.getByLabelText('text'), 'nirgendwo');
    expect(window.localStorage.length).toBe(0);
  });

  /** Text abandoned a fortnight ago is not restored; its author has long forgotten it. */
  it('drops a draft that is too old to be wanted', () => {
    const fifteenDays = Date.now() - 15 * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(
      'buero:draft:task-e',
      JSON.stringify({ at: fifteenDays, value: 'vor langer Zeit' }),
    );

    render(<Box draftKey="task-e" />);
    expect(screen.getByLabelText('text')).toHaveValue('');
    expect(window.localStorage.getItem('buero:draft:task-e')).toBeNull();
  });

  /** Private windows throw on access. Losing the draft is acceptable; a blank screen is not. */
  it('still renders when storage refuses to work', async () => {
    /** What this environment ships by default, and what a private window behaves like. */
    Object.defineProperty(window, 'localStorage', {
      value: {},
      configurable: true,
      writable: true,
    });
    try {
      render(<Box draftKey="task-f" initial="trotzdem da" />);
      expect(screen.getByLabelText('text')).toHaveValue('trotzdem da');
      const user = userEvent.setup();
      await act(async () => {
        await user.type(screen.getByLabelText('text'), '!');
      });
      expect(screen.getByLabelText('text')).toHaveValue('trotzdem da!');
    } finally {
      installStorage();
    }
  });
});
