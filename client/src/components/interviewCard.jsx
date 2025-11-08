import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Volume2, Loader2 } from 'lucide-react';

const InterviewCard = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('idle');
    const [timeLeft, setTimeLeft] = useState(0); // in seconds
    const timerRef = useRef(null);

    // Load interview details
    useEffect(() => {
        const interviews = JSON.parse(localStorage.getItem('interviews')) || [];
        const found = interviews.find((i) => i.id === interviewId);
        setInterview(found);
        if (found) setTimeLeft(found.duration * 60); // convert minutes to seconds
    }, [interviewId]);

    // Countdown effect
    useEffect(() => {
        if (status === 'ready' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        if (timeLeft === 0 && status === 'ready') {
            handleEndInterview();
        }
        return () => clearInterval(timerRef.current);
    }, [status, timeLeft]);

    // Format time MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Handle Start Interview
    const handleStartInterview = () => {
        setStatus('loading');
        setTimeout(() => {
            setStatus('ready');
            setIsRecording(true);
        }, 1200);
    };

    // Handle End Interview
    const handleEndInterview = () => {
        clearInterval(timerRef.current);
        setIsRecording(false);
        setStatus('ended');

        // Update localStorage (mark as completed)
        const interviews = JSON.parse(localStorage.getItem('interviews')) || [];
        const updated = interviews.map((i) =>
            i.id === interviewId ? { ...i, status: 'completed' } : i
        );
        localStorage.setItem('interviews', JSON.stringify(updated));

        // Navigate back after short delay
        setTimeout(() => navigate('/app'), 1000);
    };

    if (!interview) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Interview not found
                    </h2>
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <button
                    onClick={() => navigate('/app')}
                    className=" flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition cursor-pointer "
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                            {status === 'loading' ? (
                                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
                            ) : (
                                <Mic className="w-12 h-12 text-gray-600" />
                            )}
                        </div>

                        <div className="mb-2 px-4 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full inline-block">
                            AI Interviewer
                        </div>

                        {status === 'ready' ? (
                            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                                Interview in progress 🎙️
                            </h1>
                        ) : (
                            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                                Ready to start your interview?
                            </h1>
                        )}

                        {/* Position & Duration */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <div className="flex items-center justify-between text-left">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Position</p>
                                    <p className="font-semibold text-gray-900">
                                        {interview.position}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">Time Left</p>
                                    <p className="font-semibold text-gray-900">
                                        {status === 'ready'
                                            ? formatTime(timeLeft)
                                            : `${interview.duration}:00`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recording Status */}
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8">
                            <div
                                className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                                    }`}
                            ></div>
                            <span>
                                {isRecording
                                    ? 'Recording active • Speak naturally'
                                    : 'AI-powered voice interview • Speak naturally'}
                            </span>
                        </div>

                        {/* Buttons */}
                        {status === 'idle' && (
                            <button
                                onClick={handleStartInterview}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-purple-600 text-white font-medium rounded-lg transition-all active:scale-95 mb-6 cursor-pointer"
                            >
                                <Mic className="w-5 h-5" />
                                Start Interview
                            </button>
                        )}

                        {status === 'ready' && (
                            <button
                                onClick={handleEndInterview}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-medium rounded-lg transition-all active:scale-95 mb-6 cursor-pointer"
                            >
                                End Interview
                            </button>
                        )}

                        {/* Test Buttons */}
                        {status === 'idle' && (
                            <div className="flex items-center justify-center gap-4">
                                <button className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    <Mic className="w-4 h-4" />
                                    Test Mic
                                </button>
                                <button className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                                    <Volume2 className="w-4 h-4" />
                                    Test Config
                                </button>
                            </div>
                        )}

                        {/* Voice Tips */}
                        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <div className="text-blue-600 mt-0.5">💡</div>
                                <div className="text-left">
                                    <p className="font-medium text-blue-900 mb-1">Voice Tips</p>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Speak clearly and naturally</li>
                                        <li>• You can interrupt the AI anytime</li>
                                        <li>• Pause briefly between thoughts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Panel */}
                <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                                Status & Details
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-500' : 'bg-red-500'
                                            }`}
                                    ></span>
                                    Connection: {isRecording ? 'Connected' : 'Disconnected'}
                                </span>
                                <span className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${isRecording ? 'bg-green-500' : 'bg-gray-400'
                                            }`}
                                    ></span>
                                    Recording: {isRecording ? 'Active' : 'Inactive'}
                                </span>
                                <span>Status: {status === 'ready' ? 'Recording' : 'Idle'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Duration</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {interview.duration} min
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Questions: {interview.questions}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Interview Type</p>
                            <p className="text-sm font-medium text-gray-900">
                                {interview.type}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Difficulty</p>
                            <p className="text-sm font-medium text-gray-900">
                                {interview.difficulty}
                            </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Messages</p>
                            <p className="text-sm font-medium text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
