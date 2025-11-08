// src/pages/Interview.jsx
import React, { useEffect, useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // You can replace this with your toast lib

const Interview = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Simulated API fetch (replace later with MongoDB API)
    useEffect(() => {
        setTimeout(() => {
            setInterviews([
                {
                    _id: "1",
                    position: "Frontend Developer",
                    companyName: "Google",
                    status: "completed",
                    difficulty: "medium",
                    createdAt: "2025-11-05T10:00:00Z",
                },
                {
                    _id: "2",
                    position: "Backend Engineer",
                    companyName: "Amazon",
                    status: "pending",
                    difficulty: "hard",
                    createdAt: "2025-11-01T14:00:00Z",
                },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const handleCreateInterview = () => {
        setIsCreating(true);

        setTimeout(() => {
            setIsCreating(false);
            toast.success("Interview created successfully!");
        }, 1200);
    };

    const handleViewInterview = (id) => {
        navigate(`/interview/${id}`);
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-700">
                    My Interviews 🎯
                </h1>
                <button
                    onClick={handleCreateInterview}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create Interview
                </button>
            </div>

            {isCreating && (
                <div className="flex justify-center items-center gap-2 text-purple-500 mb-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <p>Creating interview...</p>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                </div>
            ) : interviews.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No interviews yet. Click “Create Interview” to start.</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {interviews.map((interview) => (
                        <div
                            key={interview._id}
                            className="p-6 border rounded-xl shadow hover:shadow-md bg-white transition cursor-pointer"
                            onClick={() => handleViewInterview(interview._id)}
                        >
                            <h2 className="font-semibold text-lg text-gray-900">
                                {interview.position}
                            </h2>
                            <p className="text-gray-500 text-sm">{interview.companyName}</p>

                            <div className="flex justify-between items-center mt-4">
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${interview.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : interview.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {interview.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(interview.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Interview;
