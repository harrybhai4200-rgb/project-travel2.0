import { useRef, useState, useCallback, useEffect } from 'react';

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

export function useSpeechRecognition(lang = 'en-IN') {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);

  const isSupported = typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) {
      setStatus('unsupported');
      return;
    }

    const SpeechRecognitionCtor = (window.SpeechRecognition || window.webkitSpeechRecognition)!;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const alternative = result[0];
        if (result.isFinal) {
          final += alternative.transcript + ' ';
        } else {
          interim += alternative.transcript;
        }
      }

      if (final) {
        setTranscript((prev) => (prev + ' ' + final).trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      setErrorMessage(event.error === 'not-allowed' ? 'Microphone access denied. Please allow microphone permissions.' : `Error: ${event.error}`);
      setStatus('error');
      shouldRestartRef.current = false;
    };

    recognition.onend = () => {
      if (shouldRestartRef.current) {
        try {
          recognition.start();
        } catch {
          // ignore start errors on restart
        }
      } else {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldRestartRef.current = false;
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, [isSupported, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) {
      setStatus('unsupported');
      return;
    }
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage('');
    shouldRestartRef.current = true;
    try {
      recognitionRef.current.start();
      setStatus('listening');
    } catch {
      // already started — restart
      try {
        recognitionRef.current.abort();
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
            setStatus('listening');
          } catch {
            setStatus('error');
          }
        }, 200);
      } catch {
        setStatus('error');
      }
    }
  }, []);

  const stop = useCallback(() => {
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage('');
    setStatus('idle');
  }, []);

  return {
    transcript,
    interimTranscript,
    status,
    errorMessage,
    isSupported: !!isSupported,
    start,
    stop,
    reset,
  };
}
