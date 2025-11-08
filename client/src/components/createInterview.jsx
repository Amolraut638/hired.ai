import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Briefcase, Building2, FileText,
    Target, Clock, BarChart3
} from 'lucide-react';

const CreateInterview = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        description: '',
        type: '',
        duration: '',
        difficulty: ''
    });

    const [showTypeMenu, setShowTypeMenu] = useState(false);
    const [showDurationMenu, setShowDurationMenu] = useState(false);
    const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);

    const interviewTypes = [
        { value: 'technical', label: 'Technical Interview', icon: Target },
        { value: 'behavioral', label: 'Behavioral Interview', icon: BarChart3 },
        { value: 'system-design', label: 'System Design Interview', icon: FileText },
        { value: 'problem-solving', label: 'Problem Solving Interview', icon: Target },
        { value: 'leadership', label: 'Leadership Interview', icon: BarChart3 }
    ];

    const durations = ['2', '5', '10', '15', '30', '45', '60'];
    const difficulties = [
        { value: 'easy', label: 'Easy', color: 'text-green-600' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
        { value: 'hard', label: 'Hard', color: 'text-red-600' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const newInterview = {
            id: Date.now().toString(),
            ...formData,
            status: 'pending',
            questions: 2,
            createdAt: new Date().toLocaleDateString(),
        };
        const existing = JSON.parse(localStorage.getItem('interviews')) || [];
        localStorage.setItem('interviews', JSON.stringify([...existing, newInterview]));
        navigate('/app');
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <button
                    onClick={() => navigate('/app')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-5 border-b border-gray-200 sticky top-0 bg-white z-20">
                        <h1 className="text-2xl font-semibold text-gray-900">Create New Interview</h1>
                    </div>

                    {/* Make form scrollable */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-6 space-y-6 max-h-[80vh] overflow-y-auto relative"
                    >
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Briefcase className="w-4 h-4" />
                                Job Position
                            </label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => handleChange('position', e.target.value)}
                                placeholder="e.g., Node.js Backend Developer"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Building2 className="w-4 h-4" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                placeholder="e.g., Google, Amazon, Microsoft"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4" />
                                Job Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Enter job description"
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Type and Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Interview Type */}
                            <div className="relative">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Target className="w-4 h-4" />
                                    Interview Type
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowTypeMenu(!showTypeMenu)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                >
                                    {formData.type ? interviewTypes.find(t => t.value === formData.type)?.label : 'Select type'}
                                </button>

                                {showTypeMenu && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                        {interviewTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => {
                                                    handleChange('type', type.value);
                                                    setShowTypeMenu(false);
                                                }}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
                                            >
                                                <type.icon className="w-4 h-4 text-gray-600" />
                                                <span className="text-gray-700">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Duration */}
                            <div className="relative">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4" />
                                    Duration
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowDurationMenu(!showDurationMenu)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                >
                                    {formData.duration ? `${formData.duration} minutes` : 'Select duration'}
                                </button>

                                {showDurationMenu && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {durations.map((duration) => (
                                            <button
                                                key={duration}
                                                type="button"
                                                onClick={() => {
                                                    handleChange('duration', duration);
                                                    setShowDurationMenu(false);
                                                }}
                                                className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-100 last:border-0"
                                            >
                                                {duration} {duration === '60' ? 'hour' : 'minutes'}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Difficulty */}
                        <div className="relative">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <BarChart3 className="w-4 h-4" />
                                Difficulty
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowDifficultyMenu(!showDifficultyMenu)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-all focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            >
                                {formData.difficulty
                                    ? difficulties.find(d => d.value === formData.difficulty)?.label
                                    : 'Select difficulty'}
                            </button>

                            {showDifficultyMenu && (
                                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {difficulties.map((diff) => (
                                        <button
                                            key={diff.value}
                                            type="button"
                                            onClick={() => {
                                                handleChange('difficulty', diff.value);
                                                setShowDifficultyMenu(false);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                        >
                                            <span className={`font-medium ${diff.color}`}>{diff.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all active:scale-[0.98]"
                            >
                                Create Interview
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateInterview;
