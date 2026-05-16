import React, { useState, useEffect } from "react";
import CreateInterview from "../components/createInterview";
import InterviewCard from "../components/interviewCard";
import { PlusCircle, Loader2 } from "lucide-react";

const InterviewDashboard = () => {
    const [interviews, setInterviews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("interviews")) || [];
        setInterviews(stored);
    }, []);

    const handleCreate = (newInterview) => {
        const updated = [...interviews, newInterview];
        setInterviews(updated);
        localStorage.setItem("interviews", JSON.stringify(updated));
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Interviews</h1>
                    <p className="text-gray-500 text-sm">
                        Manage and track your interview progress
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition-all"
                >
                    <PlusCircle className="w-4 h-4" /> Create Interview
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            ) : interviews.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-3xl font-semibold mb-2">Master Your Next Interview</h2>
                    <p className="text-gray-500 mb-6">
                        Practice with AI-powered mock interviews tailored to your role.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all"
                    >
                        Start Your First Interview
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Your Interviews
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {interviews.map((interview, i) => (
                            <InterviewCard key={i} interview={interview} />
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen && (
                <CreateInterview
                    onClose={() => setIsModalOpen(false)}
                    onCreate={handleCreate}
                />
            )}
        </div>
    );
};

export default InterviewDashboard;
