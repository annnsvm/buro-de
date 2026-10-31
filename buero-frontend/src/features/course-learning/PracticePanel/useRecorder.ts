import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderState = 'idle' | 'recording' | 'ready' | 'denied' | 'unsupported';

export type Recorder = {
  state: RecorderState;
  /** Seconds elapsed while recording - the only sign that anything is happening. */
  seconds: number;
  /** What was just recorded, waiting to be listened to or sent. */
  take: { blob: Blob; url: string; seconds: number } | null;
  start: () => Promise<void>;
  stop: () => void;
  discard: () => void;
};

/**
 * Recording from the microphone, in the one shape this block needs.
 *
 * Two things here are not optional and are easy to get wrong. The microphone track must be
 * stopped when the take ends, or the browser keeps showing the recording indicator and the
 * student reasonably believes they are still being listened to. And every object URL must be
 * revoked, or each retake leaks the one before it - a student who records six times leaves six
 * recordings in memory.
 */
export const useRecorder = (): Recorder => {
  const [state, setState] = useState<RecorderState>(() =>
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)
      ? 'idle'
      : 'unsupported',
  );
  const [seconds, setSeconds] = useState(0);
  const [take, setTake] = useState<Recorder['take']>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const startedAt = useRef(0);
  const tick = useRef<number | null>(null);
  /** Revoking the previous URL needs the current one, and effects must not depend on state. */
  const url = useRef<string | null>(null);

  const stopTrack = useCallback(() => {
    recorder.current?.stream.getTracks().forEach((track) => track.stop());
    recorder.current = null;
    if (tick.current !== null) {
      window.clearInterval(tick.current);
      tick.current = null;
    }
  }, []);

  /** Leaving the block mid-take must release the microphone, not keep it open. */
  useEffect(
    () => () => {
      stopTrack();
      if (url.current) URL.revokeObjectURL(url.current);
    },
    [stopTrack],
  );

  const start = useCallback(async () => {
    if (state === 'unsupported') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream);
      chunks.current = [];
      media.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.current.push(event.data);
      };
      media.onstop = () => {
        const blob = new Blob(chunks.current, {
          type: media.mimeType || 'audio/webm',
        });
        if (url.current) URL.revokeObjectURL(url.current);
        url.current = URL.createObjectURL(blob);
        setTake({
          blob,
          url: url.current,
          seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
        });
        setState('ready');
        stopTrack();
      };

      recorder.current = media;
      startedAt.current = Date.now();
      setSeconds(0);
      media.start();
      setState('recording');
      tick.current = window.setInterval(
        () => setSeconds(Math.round((Date.now() - startedAt.current) / 1000)),
        250,
      );
    } catch {
      /** Refusing the microphone is a choice, not a fault; it is reported as one. */
      setState('denied');
    }
  }, [state, stopTrack]);

  const stop = useCallback(() => {
    if (recorder.current?.state === 'recording') recorder.current.stop();
  }, []);

  const discard = useCallback(() => {
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = null;
    setTake(null);
    setSeconds(0);
    setState('idle');
  }, []);

  return { state, seconds, take, start, stop, discard };
};

/** mm:ss, because a recording is read as a duration and never as a number of seconds. */
export const asClock = (seconds: number): string => {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
};
