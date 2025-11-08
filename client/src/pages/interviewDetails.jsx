// src/pages/InterviewDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart2, MessageSquare, Loader2 } from "lucide-react";

const InterviewDetails = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated data fetch
        setTimeout(() => {
            setInterview({
                _id: interviewId,
                position: "Frontend Developer",
                companyName: "Google",
                difficulty: "medium",
                duration: "45 min",
                jobDescription:
                    "Develop and maintain user interfaces using React.js and TypeScript.",
                questions: [
                    "What is the Virtual DOM in React?",
                    "Explain the difference between useEffect and useLayoutEffect.",
                    "How does React handle reconciliation?",
                ],
                feedback: {
                    summary:
                        "Strong understanding of frontend fundamentals. Good at explaining technical concepts. Needs minor improvement in performance optimization.",
                    rating: 4.2,
                },
            });
            setLoading(false);
        }, 1000);
    }, [interviewId]);

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
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {interview.position}
                </h1>
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
                    <ul className="space-y-2">
                        {interview.questions.map((q, idx) => (
                            <li
                                key={idx}
                                className="border rounded-md p-3 text-sm text-gray-700 bg-gray-50"
                            >
                                {idx + 1}. {q}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <BarChart2 className="w-5 h-5" /> Feedback Summary
                    </h2>
                    <p className="text-gray-700 mb-2">{interview.feedback.summary}</p>
                    <p className="font-semibold text-purple-700">
                        ⭐ Rating: {interview.feedback.rating} / 5
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InterviewDetails;
