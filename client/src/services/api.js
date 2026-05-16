// API service for all backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Make API request with auth header
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = token;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// User APIs
export const userAPI = {
  register: (name, email, password) =>
    apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getUserData: () =>
    apiCall('/users/data', { method: 'GET' }),
};

// Interview APIs
export const interviewAPI = {
  createInterview: (data) =>
    apiCall('/interviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getInterviews: () =>
    apiCall('/interviews', { method: 'GET' }),

  getInterview: (id) =>
    apiCall(`/interviews/${id}`, { method: 'GET' }),
  submitAnswers: async (id, answers) => {
    // If the id is not a Mongo ObjectId, treat it as a local (mock) interview id
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isObjectId) {
      const local = JSON.parse(localStorage.getItem('interviews')) || [];
      const idx = local.findIndex((i) => i.id === id || i._id === id);
      if (idx === -1) {
        throw new Error('Interview not found locally');
      }

      const interview = local[idx];
      const questionsArray = Array.isArray(interview.questions)
        ? interview.questions
        : Array.from({ length: Number(interview.questions) || answers.length }, (_, i) => `Question ${i + 1}`);

      // Map answers to questions and add a placeholder evaluation
      const evaluation = questionsArray.map((q, i) => {
        const ansObj = Array.isArray(answers) ? answers.find((a) => a.index === i) : null;
        const userAnswer = ansObj ? ansObj.answer : '';
        return {
          index: i,
          question: typeof q === 'string' ? q : q.questionText || `Question ${i + 1}`,
          answer: userAnswer,
          feedback: 'Local submission — no AI evaluation. Use server-generated interviews for AI feedback.',
          score: 0,
        };
      });

      // Persist user's answers locally and mark interview completed
      const updatedInterview = {
        ...interview,
        status: 'completed',
        questions: questionsArray.map((q, i) => ({
          questionText: typeof q === 'string' ? q : q.questionText,
          userAnswer: evaluation[i].answer,
          aiFeedback: evaluation[i].feedback,
          score: evaluation[i].score,
        })),
      };

      local[idx] = updatedInterview;
      localStorage.setItem('interviews', JSON.stringify(local));

      return Promise.resolve({ success: true, data: updatedInterview });
    }

    return apiCall(`/interviews/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },
  deleteInterview: (id) =>
    apiCall(`/interviews/${id}`, { method: 'DELETE' }),
};

// Problem APIs
export const problemAPI = {
  getAllProblems: () =>
    apiCall('/problems', { method: 'GET' }),

  getProblemById: (id) =>
    apiCall(`/problems/${id}`, { method: 'GET' }),

  toggleProblemStatus: (id) =>
    apiCall(`/problems/${id}/toggle`, { method: 'PATCH' }),

  getUserStats: () =>
    apiCall('/problems/stats', { method: 'GET' }),
};

// Feedback APIs
export const feedbackAPI = {
  createFeedback: (data) =>
    apiCall('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getFeedbackByInterview: (interviewId) =>
    apiCall(`/feedback/interview/${interviewId}`, { method: 'GET' }),

  getFeedbackByUser: (userId) =>
    apiCall(`/feedback/user/${userId}`, { method: 'GET' }),
};

  // Chatbot API
export const chatbotAPI = {
  sendMessage: (history, message) =>
    apiCall('/chatbot', {
      method: 'POST',
      body: JSON.stringify({ history, message }),
    }),
};

export default {
  userAPI,
  interviewAPI,
  problemAPI,
  feedbackAPI,
  chatbotAPI
};
