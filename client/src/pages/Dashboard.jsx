import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Plus, Clock, Target, BarChart3 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const mockInterviews = JSON.parse(localStorage.getItem('interviews')) || [];
    setInterviews(mockInterviews);
  }, []);

  const handleCreateInterview = () => {
    navigate('/app/create-interview');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2 font-semibold"><span className="text-purple-600">Hello,</span> {user.name} !</h1>
          <p className="text-gray-600">Manage and track your interview progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">{interviews.length}</p>
                <p className="text-sm text-gray-600">Total Interviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {interviews.filter(i => i.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {interviews.filter(i => i.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleCreateInterview}
            className="flex items-center gap-3 p-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <div className="text-left">
              <p className="font-semibold text-lg">Create Interview</p>
              <p className="text-sm text-purple-100">Start a new AI-powered mock interview</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/app/dsaprep')}
            className="flex items-center gap-3 p-6 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            <div className="p-3 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg text-gray-900">Practice DSA</p>
              <p className="text-sm text-gray-600">Solve coding problems</p>
            </div>
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Your Interviews</h2>
            <p className="text-sm text-gray-600 mt-1">
              {interviews.length === 0 ? 'No interviews yet' : `${interviews.length} interview${interviews.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {interviews.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
              <p className="text-gray-600 mb-6">Create your first AI-powered mock interview to get started</p>
              <button
                onClick={handleCreateInterview}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" />
                Create Interview
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <div key={interview.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{interview.position}</h3>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${interview.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {interview.status === 'pending' ? 'Pending' : 'Completed'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {interview.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {interview.duration} min
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${interview.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            interview.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                          }`}>
                          {interview.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{interview.description}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{interview.questions} Questions</span>
                        <span>•</span>
                        <span>{interview.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-6">
                      <button
                        onClick={() => navigate(`/app/interview/${interview.id}`)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        View
                      </button>
                      {interview.status === 'pending' && (
                        <button
                          onClick={() => navigate(`/app/start-interview/${interview.id}`)}
                          className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all active:scale-95 cursor-pointer"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;