// src/pages/InterviewDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, BarChart2, MessageSquare, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { interviewAPI } from "../services/api";

const InterviewDetails = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const location = useLocation();

    useEffect(() => {
        fetchInterviewDetails();
    }, [interviewId, location.state]);

    const fetchInterviewDetails = async () => {
        try {
            setLoading(true);

            // If caller passed interview data through navigation state, use it (avoids fetching)
            if (location.state && location.state.data) {
                const data = location.state.data;
                setInterview(data);
                const initialAnswers = {};
                (data.questions || []).forEach((_, idx) => {
                    initialAnswers[idx] = '';
                });
                setAnswers(initialAnswers);
                setSubmitted(data.status === 'completed');
                return;
            }

            // If id is not a Mongo ObjectId, try to load from localStorage
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(interviewId);
            if (!isObjectId) {
                const local = JSON.parse(localStorage.getItem('interviews')) || [];
                const found = local.find((i) => i.id === interviewId || i._id === interviewId);
                if (found) {
                    const questionsArray = Array.isArray(found.questions)
                        ? found.questions
                        : Array.from({ length: Number(found.questions) || 3 }, (_, i) => ({ questionText: `Question ${i + 1}` }));

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
                    setSubmitted(interviewData.status === 'completed');
                    return;
                }
            }

            // Fall back to API call for server-backed interviews
            const response = await interviewAPI.getInterview(interviewId);
            setInterview(response.data);
            // Initialize answers object
            const initialAnswers = {};
            response.data.questions?.forEach((_, idx) => {
                initialAnswers[idx] = '';
            });
            setAnswers(initialAnswers);
            setSubmitted(response.data.status === 'completed');
        } catch (err) {
            console.error('Failed to fetch interview:', err);
            toast.error('Failed to load interview details');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (index, value) => {
        setAnswers(prev => ({
            ...prev,
            [index]: value
        }));
    };

    const handleDelete = () => {
        toast.warning("Are you sure you want to delete this interview?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        setLoading(true);
                        await interviewAPI.deleteInterview(interviewId);
                        toast.success('Interview deleted successfully');
                        navigate('/app');
                    } catch (err) {
                        console.error('Failed to delete interview:', err);
                        toast.error('Failed to delete interview');
                        setLoading(false);
                    }
                },
            },
        });
    };

    const handleSubmitAnswers = async () => {
        if (!interview?.questions || interview.questions.length === 0) {
            toast.error('No questions found');
            return;
        }

        // Validate all answers are filled
        const allAnswersFilled = interview.questions.every((_, idx) => answers[idx]?.trim());
        if (!allAnswersFilled) {
            toast.error('Please answer all questions');
            return;
        }

        try {
            setSubmitting(true);
            const answersArray = interview.questions.map((q, idx) => ({
                index: idx,
                answer: answers[idx]
            }));

            const response = await interviewAPI.submitAnswers(interviewId, answersArray);
            
            toast.success('Answers submitted successfully! AI evaluation complete.');
            // Ensure we use the updated data from the response
            const updatedData = response.data;
            setInterview(updatedData);
            setSubmitted(updatedData.status === 'completed');
        } catch (err) {
            console.error('Failed to submit answers:', err);
            toast.error(err.message || 'Failed to submit answers');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <button
                onClick={() => navigate("/app")}
                className="flex items-center text-purple-600 hover:text-purple-800 mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Interviews
            </button>

            <div className="bg-white rounded-lg shadow-lg p-6 border">
                {typeof interview?.generatedByAI !== 'undefined' && (
                    <div className="mb-4">
                        {interview.generatedByAI ? (
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Questions generated by AI</div>
                        ) : (
                            <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Fallback questions used{interview.aiError ? ` — ${interview.aiError}` : ''}</div>
                        )}
                    </div>
                )}
                <div className="flex justify-between items-start mb-1">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {interview.position}
                    </h1>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Interview"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-500 mb-4">at {interview.companyName}</p>

                <div className="flex justify-between mb-4">
                    <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                        Difficulty: {interview.difficulty}
                    </span>
                    <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        Duration: {interview.duration}
                    </span>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-2">Job Description</h2>
                    <p className="text-gray-700">{interview.jobDescription}</p>
                </div>

                <div className="mb-6">
                    <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" /> Interview Questions
                    </h2>
                    <div className="space-y-4">
                        {interview.questions.map((q, idx) => (
                            <div key={idx} className="border rounded-md p-4 bg-gray-50">
                                <p className="font-medium text-gray-800 mb-2">
                                    {idx + 1}. {q.questionText || q}
                                </p>
                                
                                {submitted ? (
                                    <>
                                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                                            <p className="text-sm font-medium text-blue-900 mb-1">Your Answer:</p>
                                            <p className="text-gray-700">{q.userAnswer || "No answer provided"}</p>
                                        </div>
                                        {q.suggestedAnswer && (
                                            <div className="bg-green-50 border border-green-200 rounded p-3 mb-2">
                                                <p className="text-sm font-medium text-green-900 mb-1">Suggested Answer:</p>
                                                <p className="text-gray-700 text-sm">{q.suggestedAnswer}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <textarea
                                        value={answers[idx] || ''}
                                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                        placeholder="Type your answer here..."
                                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        rows="4"
                                        disabled={submitted}
                                    />
                                )}

                                {submitted && q.aiFeedback && (
                                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-sm font-medium text-yellow-900">AI Feedback:</p>
                                        <p className="text-gray-700 text-sm mt-1">{q.aiFeedback}</p>
                                        {q.score !== undefined && (
                                            <p className="text-sm font-semibold text-purple-700 mt-1">
                                                Score: {q.score}/10
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {!submitted && (
                    <button
                        onClick={handleSubmitAnswers}
                        disabled={submitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg transition font-medium"
                    >
                        {submitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Submitting answers...</span> : 'Submit Answers & Get AI Feedback'}
                    </button>
                )}

                {submitted && interview.rating && (
                    <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">Interview Results</h3>
                        <p className="text-gray-700 mb-2">{interview.feedback}</p>
                        <p className="font-semibold text-purple-700">
                            ⭐ Overall Rating: {interview.rating.toFixed(1)} / 5
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewDetails;
