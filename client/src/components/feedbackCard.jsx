import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const FeedbackCard = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // You can later replace this mock with actual API call
        setTimeout(() => {
            setFeedback({
                position: "Frontend Developer",
                rating: 4.3,
                strengths: ["Good React skills", "Clean UI", "Problem-solving mindset"],
                improvements: ["Better optimization", "Improve testing skills"],
                summary: "You performed well overall! Great job!",
            });
            setLoading(false);
        }, 1000);
    }, [interviewId]);

    if (loading)
        return <Loader/>

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 w-[500px] border">
                <h1 className="text-2xl font-bold text-purple-700 mb-2 text-center">
                    Feedback Summary
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    For: <strong>{feedback.position}</strong>
                </p>

                <p className="text-yellow-500 text-lg font-semibold mb-4">
                    ⭐ {feedback.rating} / 5
                </p>

                <div className="text-left space-y-4">
                    <div>
                        <h2 className="font-semibold text-green-700">Strengths</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            {feedback.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-red-600">Improvements</h2>
                        <ul className="list-disc pl-6 text-gray-700">
                            {feedback.improvements.map((i, idx) => (
                                <li key={idx}>{i}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-800">AI Summary</h2>
                        <p className="text-gray-600">{feedback.summary}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate("/app")}
                    className="mt-6 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default FeedbackCard;
