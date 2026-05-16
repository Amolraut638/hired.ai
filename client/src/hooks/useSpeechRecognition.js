import { useState, useRef, useEffect } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const lastFinalRef = useRef(''); // ✅ prevent duplicates

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // ✅ Detect mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // ✅ Mobile-safe configuration
    recognition.continuous = !isMobile; // false on mobile
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript.trim();

        if (event.results[i].isFinal) {
          final += text + ' ';
        } else {
          interim += text;
        }
      }

      // ✅ Show interim live text
      setInterimTranscript(interim);

      // ✅ Prevent duplicate final results (MAIN FIX)
      if (final && final !== lastFinalRef.current) {
        setTranscript((prev) => (prev + ' ' + final).trim());
        lastFinalRef.current = final;
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // ❌ DO NOT append interim here (causes duplication on mobile)
    };

    return () => {
      recognition.abort();
    };
  }, []);

  // ✅ Start Listening
  const startListening = ({ reset = true } = {}) => {
    if (!recognitionRef.current) return;

    if (reset) {
      setTranscript('');
      setInterimTranscript('');
      setError('');
      lastFinalRef.current = ''; // ✅ reset duplicate tracker
    }

    try {
      recognitionRef.current.start();
    } catch (e) {
      // Ignore "already started" error
    }
  };

  // ✅ Stop Listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // ✅ Clear manually
  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    lastFinalRef.current = '';
  };

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    clearTranscript,
  };
};

export default useSpeechRecognition;