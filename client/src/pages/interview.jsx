// src/pages/Interview.jsx
import React, { useEffect, useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { interviewAPI } from "../services/api";

const Interview = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        companyName: '',
        difficulty: 'medium',
        duration: '10',
        generate: true
    });
    const navigate = useNavigate();

    // Fetch interviews from backend
    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const response = await interviewAPI.getInterviews();
            setInterviews(response.data || []);
        } catch (err) {
            console.error('Failed to fetch interviews:', err);
            toast.error('Failed to load interviews');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInterview = async (e) => {
        e.preventDefault();
        
        if (!formData.position) {
            toast.error('Please enter a position');
            return;
        }

        try {
            setIsCreating(true);
            const response = await interviewAPI.createInterview({
                position: formData.position,
                companyName: formData.companyName || 'Unknown Company',
                difficulty: formData.difficulty,
                duration: `${formData.duration} min`,
                generate: formData.generate,
                userId: localStorage.getItem('userId') // Ensure userId is set from login
            });
            
            toast.success("Interview created successfully!");
            setFormData({ position: '', companyName: '', difficulty: 'medium', duration: '10', generate: true });
            setShowCreateForm(false);
            await fetchInterviews(); // Refresh the list
        } catch (err) {
            console.error('Failed to create interview:', err);
            toast.error(err.message || 'Failed to create interview');
        } finally {
            setIsCreating(false);
        }
    };

    const handleViewInterview = (interview) => {
        if (interview.status === 'completed') {
            navigate(`/app/interview/${interview._id}`);
        } else {
            navigate(`/app/start-interview/${interview._id}`);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-purple-700">
                    My Interviews 🎯
                </h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create Interview
                </button>
            </div>

            {showCreateForm && (
                <div className="mb-8 p-6 bg-gray-50 border border-gray-300 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Create New Interview</h2>
                    <form onSubmit={handleCreateInterview} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Position *</label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({...formData, position: e.target.value})}
                                placeholder="e.g., Frontend Engineer"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Company Name</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                placeholder="e.g., Google"
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="2">2 min</option>
                                <option value="5">5 min</option>
                                <option value="10">10 min</option>
                                <option value="15">15 min</option>
                                <option value="30">30 min</option>
                                <option value="45">45 min</option>
                                <option value="60">60 min</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
                            >
                                {isCreating ? 'Creating...' : 'Create Interview'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
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
                            className="p-6 border rounded-xl shadow hover:shadow-md bg-white transition cursor-pointer flex flex-col justify-between"
                            onClick={() => handleViewInterview(interview)}
                        >
                            <div>
                                <h2 className="font-semibold text-lg text-gray-900">
                                    {interview.position}
                                </h2>
                                <p className="text-gray-500 text-sm">{interview.companyName}</p>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${interview.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {interview.status === 'completed' ? 'Completed' : 'Scheduled'}
                                </span>
                                <button 
                                    className="text-purple-600 text-sm font-medium hover:underline"
                                >
                                    {interview.status === 'completed' ? 'View Feedback' : 'Start Interview'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Interview;
