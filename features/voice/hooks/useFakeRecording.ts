import { useCallback, useEffect, useRef, useState } from 'react';

const INITIAL_TRANSCRIPT = 'Listening...';

/**
 * Scripted transcript stages. Each tick reveals the next one, simulating
 * progressive speech recognition. (No real audio or speech APIs are used.)
 */
const TRANSCRIPT_STAGES = [
  'Playing the Bluebird Cafe next Friday...',
  'Playing the Bluebird Cafe next Friday at 8 PM...',
  'Playing the Bluebird Cafe next Friday at 8 PM. Tickets are $20...',
  'Playing the Bluebird Cafe next Friday at 8 PM. Tickets are $20. Hope to see everyone there.',
];

const TRANSCRIPT_STEP_MS = 1500;
const PROCESSING_DELAY_MS = 1000;

export type FakeRecordingStatus = 'recording' | 'processing';

type UseFakeRecordingOptions = {
  /** Called with the captured transcript after the processing delay. */
  onFinish: (transcript: string) => void;
};

type UseFakeRecordingResult = {
  transcript: string;
  isRecording: boolean;
  isProcessing: boolean;
  stop: () => void;
};

/**
 * Owns the fake recording lifecycle: a timer that progressively reveals a
 * scripted transcript, the current transcript text, and the recording state.
 * Calling `stop` pauses the timer, enters the processing state, and after a
 * short delay invokes `onFinish` with the captured transcript.
 */
export function useFakeRecording({ onFinish }: UseFakeRecordingOptions): UseFakeRecordingResult {
  const [transcript, setTranscript] = useState(INITIAL_TRANSCRIPT);
  const [status, setStatus] = useState<FakeRecordingStatus>('recording');

  const stepRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const processingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the latest values available to the deferred callbacks.
  const statusRef = useRef<FakeRecordingStatus>('recording');
  const transcriptRef = useRef(transcript);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = TRANSCRIPT_STAGES[stepRef.current];
      if (next !== undefined) {
        setTranscript(next);
      }
      stepRef.current += 1;

      if (stepRef.current >= TRANSCRIPT_STAGES.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, TRANSCRIPT_STEP_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (processingRef.current) {
        clearTimeout(processingRef.current);
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (statusRef.current === 'processing') {
      return;
    }
    statusRef.current = 'processing';
    setStatus('processing');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    processingRef.current = setTimeout(() => {
      const captured = transcriptRef.current === INITIAL_TRANSCRIPT ? '' : transcriptRef.current;
      onFinishRef.current(captured);
    }, PROCESSING_DELAY_MS);
  }, []);

  return {
    transcript,
    isRecording: status === 'recording',
    isProcessing: status === 'processing',
    stop,
  };
}
