import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Play, SkipForward, Loader2, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { interviewAPI } from '../services/api';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

const VoiceInterview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [secondsPerQuestion, setSecondsPerQuestion] = useState(45);
  const answerTimerRef = React.useRef(null);
  const [listeningRemaining, setListeningRemaining] = useState(0);
  const listeningIntervalRef = React.useRef(null);
  const listeningStartedAtRef = React.useRef(null);
  const retryCountRef = React.useRef(0);
  const MIN_ANSWER_WAIT_MS = 5000; // ensure at least 5 seconds for candidate to start answering
  const MAX_RESTARTS = 2;

  const {
    transcript,
    interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    fetchInterview();
  }, [interviewId]);

  useEffect(() => {
    return () => {
      if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
    };
  }, []);

  // Compute per-question timeout based on interview.duration when interview is available
  useEffect(() => {
    if (!interview) return;
    // try to extract number of minutes from strings like '30', '30 min', '30 mins', '30m'
    const d = (interview.duration || '').toString();
    const m = parseInt(d.match(/\d+/)?.[0] || '0', 10) || 0;
    const totalSeconds = Math.max(60, m * 60 || 600); // default to 10 minutes if parsing fails
    const per = Math.max(10, Math.floor(totalSeconds / Math.max(1, (interview.questions || []).length)));
    setSecondsPerQuestion(per);
  }, [interview]);

  // Auto-save transcript when it's finalized
  useEffect(() => {
    if (transcript && !isListening) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestionIndex]: transcript,
      }));
    }
  }, [isListening, transcript]);

  const fetchInterview = async () => {
    try {
      setLoading(true);
      // If the id is not a Mongo ObjectId (24 hex chars), try to load from localStorage
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(interviewId);
      if (!isObjectId) {
        const local = JSON.parse(localStorage.getItem('interviews')) || [];
        const found = local.find((i) => i.id === interviewId || i._id === interviewId);
        if (found) {
          // Normalize local interview into the shape expected by this component
          const questionsArray = Array.isArray(found.questions)
            ? found.questions
            : Array.from({ length: Number(found.questions) || 3 }, (_, i) => `Question ${i + 1} about ${found.position || 'the role'}`);

          const interviewData = {
            _id: found.id,
            position: found.position,
            companyName: found.company || found.companyName || 'Unknown Company',
            difficulty: found.difficulty || 'medium',
            questions: questionsArray,
            duration: found.duration || '10',
            createdAt: found.createdAt || new Date().toISOString(),
            status: found.status || 'scheduled',
          };

          setInterview(interviewData);
          const initialAnswers = {};
          interviewData.questions.forEach((_, idx) => {
            initialAnswers[idx] = '';
          });
          setAnswers(initialAnswers);
          return;
        }
        // if not found locally, fall back to API (so server can return 404 or error)
      }

      const response = await interviewAPI.getInterview(interviewId);
      setInterview(response.data);
      const initialAnswers = {};
      response.data.questions?.forEach((_, idx) => {
        initialAnswers[idx] = '';
      });
      setAnswers(initialAnswers);
    } catch (err) {
      console.error('Failed to fetch interview:', err);
      toast.error('Failed to load interview');
      navigate('/app');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    // If this interview was created locally (timestamp id), generate AI questions on server when user is logged in
    const currentId = interview._id || interviewId;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(currentId);

    if (!isObjectId) {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to generate AI questions for this interview');
        return;
      }

      try {
        setLoading(true);
        toast('Generating AI questions — this may take a few seconds');
        const resp = await interviewAPI.createInterview({
          position: interview.position,
          companyName: interview.companyName,
          difficulty: interview.difficulty,
          duration: interview.duration,
          jobDescription: interview.jobDescription || interview.description || '',
          generate: true,
          userId: localStorage.getItem('userId') || undefined,
        });

        // Replace route so we now work with server-backed interview id
        const serverInterview = resp.data;
        setInterview(serverInterview);
        setAnswers((prev) => {
          const initial = {};
          serverInterview.questions.forEach((_, idx) => (initial[idx] = prev[idx] || ''));
          return initial;
        });
        navigate(`/app/start-interview/${serverInterview._id}`, { replace: true });
        toast.success('AI questions generated');
      } catch (err) {
        console.error('Failed to generate AI questions:', err);
        toast.error('Failed to generate AI questions — please try again');
        return;
      } finally {
        setLoading(false);
      }
    }

    setInterviewStarted(true);
    // Use the generated serverInterview if available, otherwise fallback to current interview
    const first = (typeof serverInterview !== 'undefined' ? serverInterview.questions[0] : interview.questions[0]);
    speak(getQuestionText(first) || 'Question 1');
  };

  const speak = (text) => {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    // Ensure we are not listening while we speak
    stopListening();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      // After question is read, start listening for answer (small guard to avoid capturing TTS)
      setTimeout(() => {
        clearTranscript();
        setIsSpeaking(false);
        // mark when listening window started, and reset any previous retry count
        listeningStartedAtRef.current = Date.now();
        retryCountRef.current = 0;
        startListening({ reset: true });
        // Start a timeout that will stop listening after secondsPerQuestion
        if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
        answerTimerRef.current = setTimeout(() => {
          try { stopListening(); } catch (e) { /* ignore */ }
        }, (secondsPerQuestion || 45) * 1000);

        // Start visual countdown
        setListeningRemaining(secondsPerQuestion || 45);
        if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
        listeningIntervalRef.current = setInterval(() => {
          setListeningRemaining((s) => {
            if (s <= 1) {
              clearInterval(listeningIntervalRef.current);
              listeningIntervalRef.current = null;
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      }, 700);
    };

    speechSynthesis.speak(utterance);
  };

  // Helper to extract human readable text from question objects or strings
  const getQuestionText = (q) => {
    if (!q) return '';
    if (typeof q === 'string') return q;
    // prefer common fields
    if (q.questionText) return q.questionText;
    if (q.question) return q.question;
    if (q.text) return q.text;
    // take the longest string-like field
    const vals = Object.values(q).filter((v) => typeof v === 'string' && v.trim());
    if (vals.length) {
      return vals.sort((a, b) => b.length - a.length)[0];
    }
    // fallback to JSON string
    return JSON.stringify(q);
  };

  const handleNextQuestion = async () => {
    // Stop listening and advance to next question (no confirm)
    stopListening();
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswered(false);
      const nextQuestion = interview.questions[currentQuestionIndex + 1];
      speak(getQuestionText(nextQuestion));
    } else {
      setIsAnswered(true);
    }
  };

  const handleFinishAnswer = () => {
    stopListening();
    setIsAnswered(true);
  };

  const handleSubmitInterview = async () => {
    try {
      setSubmitting(true);
      speechSynthesis.cancel();

      const answersArray = interview.questions.map((q, idx) => ({
        index: idx,
        answer: answers[idx] || '',
      }));

      const response = await interviewAPI.submitAnswers(interviewId, answersArray);
      toast.success('Interview submitted successfully!');
      
      // Navigate to results page (use the protected /app route)
      navigate(`/app/interview/${interviewId}`, { state: { submitted: true, data: response.data } });
    } catch (err) {
      console.error('Failed to submit interview:', err);
      toast.error(err.message || 'Failed to submit interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReRecord = () => {
    clearTranscript();
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: '',
    }));
    setIsAnswered(false);
    startListening();
  };

  // Auto-advance behavior: when speech recognition stops (isListening becomes false) we autosave / advance
  useEffect(() => {
    // only run when an interview is active
    if (!interviewStarted) return;
    if (!isListening && !isSpeaking) {
      // If we recently started listening, allow a minimum grace period before auto-advancing
      const started = listeningStartedAtRef.current || 0;
      const elapsed = Date.now() - started;
      if (started && elapsed < MIN_ANSWER_WAIT_MS && retryCountRef.current < MAX_RESTARTS) {
        const remaining = MIN_ANSWER_WAIT_MS - elapsed;
        retryCountRef.current += 1;
        // Restart listening after the remaining grace period (do not reset transcript)
        setTimeout(() => {
          try {
            // Ensure any previous timers are cleared
            if (answerTimerRef.current) clearTimeout(answerTimerRef.current);
            if (listeningIntervalRef.current) {
              clearInterval(listeningIntervalRef.current);
              listeningIntervalRef.current = null;
            }
            // Re-start listening without clearing transcript
            startListening({ reset: false });
            // reset countdown UI
            setListeningRemaining(secondsPerQuestion || 45);
            if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
            listeningIntervalRef.current = setInterval(() => {
              setListeningRemaining((s) => (s <= 1 ? 0 : s - 1));
            }, 1000);
            // set a timer to stop listening after the full secondsPerQuestion
            answerTimerRef.current = setTimeout(() => { try { stopListening(); } catch (e) {} }, (secondsPerQuestion || 45) * 1000);
          } catch (e) {
            // ignore
          }
        }, remaining);
        return;
      }
      // Clear any answer timer
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
        answerTimerRef.current = null;
      }
      // Clear listening countdown
      if (listeningIntervalRef.current) {
        clearInterval(listeningIntervalRef.current);
        listeningIntervalRef.current = null;
        setListeningRemaining(0);
      }

      // If we have a transcript saved, mark answered and move to next after a short delay
      const hasAnswer = (answers[currentQuestionIndex] && answers[currentQuestionIndex].trim()) || (transcript && transcript.trim());

      if (hasAnswer) {
        // ensure transcript flush is captured by existing effect
        setIsAnswered(true);
        // small delay so UI updates and user sees 'Answer recorded'
        setTimeout(() => {
          if (currentQuestionIndex < interview.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setIsAnswered(false);
            const nextQuestion = interview.questions[currentQuestionIndex + 1];
            speak(getQuestionText(nextQuestion));
          } else {
            setIsAnswered(true);
          }
        }, 900);
      } else {
        // no answer provided -> store explicit empty and move on
        setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: '' }));
        setIsAnswered(true);
        setTimeout(() => {
          if (currentQuestionIndex < interview.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setIsAnswered(false);
            const nextQuestion = interview.questions[currentQuestionIndex + 1];
            speak(getQuestionText(nextQuestion));
          } else {
            setIsAnswered(true);
          }
        }, 700);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening, isSpeaking, transcript]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Interview not found</h2>
          <button
            onClick={() => navigate('/app')}
            className="text-purple-600 hover:text-purple-700 transition"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Banner: indicate whether AI generated or fallback */}
          {typeof interview?.generatedByAI !== 'undefined' && (
            <div className="mb-4 text-center">
              {interview.generatedByAI ? (
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Questions generated by AI</div>
              ) : (
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Fallback questions used{interview.aiError ? ` — ${interview.aiError}` : ''}</div>
              )}
            </div>
          )}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {interview.position}
            </h1>
            <p className="text-gray-600 text-lg mb-4">at {interview.companyName}</p>
            <div className="flex justify-center gap-4 mb-6">
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                Difficulty: {interview.difficulty}
              </span>
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                {interview.questions?.length} Questions
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded">
            <h2 className="font-semibold text-blue-900 mb-2">How it works:</h2>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>✓ Listen to each question carefully</li>
              <li>✓ Click the microphone to record your answer</li>
              <li>✓ Speak naturally - your speech will be converted to text</li>
              <li>✓ Review and move to the next question</li>
              <li>✓ Submit when all questions are answered</li>
            </ul>
          </div>

          <button
            onClick={handleStartInterview}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg flex items-center justify-center gap-2"
          >
            <Volume2 className="w-6 h-6" />
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const displayTranscript = transcript || interimTranscript;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Question {currentQuestionIndex + 1} of {interview.questions.length}
            </h2>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / interview.questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / interview.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {getQuestionText(currentQuestion)}
          </h3>

          {/* Voice Input Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 mb-6">
            <div className="flex flex-col items-center gap-6">
              {/* Microphone Button */}
              <button
                onClick={isListening ? stopListening : () => startListening({ reset: true })}
                disabled={isAnswered || isSpeaking}
                className={`p-8 rounded-full transition transform hover:scale-110 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? (
                  <MicOff className="w-12 h-12" />
                ) : (
                  <Mic className="w-12 h-12" />
                )}
              </button>

              {/* Status Text */}
              <div className="text-center">
                {isSpeaking ? (
                  <p className="text-blue-600 font-semibold text-lg">🔊 Speaking...</p>
                ) : isListening ? (
                  <p className="text-purple-600 font-semibold text-lg">🎙️ Listening... Speak now!</p>
                ) : isAnswered ? (
                  <p className="text-green-600 font-semibold text-lg">✓ Answer recorded</p>
                ) : (
                  <p className="text-gray-600 font-semibold text-lg">
                    Click microphone to record answer
                  </p>
                )}
                {isListening && listeningRemaining > 0 && (
                  <p className="text-sm text-gray-500">Time remaining: {listeningRemaining}s</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Transcript Display */}
          {(displayTranscript || currentAnswer) && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Your Answer:</p>
              <div className="space-y-3">
                {currentAnswer && (
                  <div className="bg-white border-l-4 border-green-500 p-3 rounded">
                    <p className="text-gray-800">{currentAnswer}</p>
                  </div>
                )}
                {displayTranscript && displayTranscript !== currentAnswer && (
                  <div className="bg-white border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-gray-600 italic">{displayTranscript}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!isAnswered ? (
              <>
                {displayTranscript && (
                  <button
                    onClick={handleFinishAnswer}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
                  >
                    ✓ Save Answer
                  </button>
                )}
                <button
                  onClick={() => speak(getQuestionText(currentQuestion))}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Repeat Question
                </button>

                {/* No explicit skip button — the interview auto-advances when you stop speaking or after a timeout */}
              </>
            ) : (
              <>
                <button
                  onClick={handleReRecord}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition"
                >
                  🔄 Re-record
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {currentQuestionIndex === interview.questions.length - 1 ? (
                    <>
                      <SkipForward className="w-5 h-5" />
                      Finish Interview
                    </>
                  ) : (
                    <>
                      <SkipForward className="w-5 h-5" />
                      Next Question
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Questions Summary */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h4 className="font-semibold text-gray-800 mb-3">Questions Progress</h4>
          <div className="flex flex-wrap gap-2">
            {interview.questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsAnswered(false);
                      clearTranscript();
                      // read the question aloud when user jumps to it
                      speak(getQuestionText(interview.questions[idx]));
                    }}
                className={`w-10 h-10 rounded-full font-bold transition ${
                  idx === currentQuestionIndex
                    ? 'bg-purple-600 text-white'
                    : answers[idx]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Interview Button - shown after all questions answered */}
        {currentQuestionIndex === interview.questions.length - 1 && isAnswered && (
          <button
            onClick={handleSubmitInterview}
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition text-lg flex items-center justify-center gap-2 mb-8"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              '✓ Submit Interview & Get AI Feedback'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;
