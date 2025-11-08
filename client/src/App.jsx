import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

//Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import FeedbackCard from "./components/feedbackCard";

//Protected Pages
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import DsaProblems from "./components/DsaProblems";
import ProtectedRoute from "./components/ProtectedRoute";

//Interview Pages
import InterviewDashboard from "./pages/interviewDashboard";
import InterviewDetails from "./pages/interviewDetails";
import Interview from "./pages/interview";
import CreateInterview from "./components/createInterview"
import InterviewCard from "./components/interviewCard";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/*Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feedback" element={<FeedbackCard />} />

        {/*Protected Dashboard Section */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Default Dashboard */}
          <Route index element={<Dashboard />} />

          {/* DSA Practice */}
          <Route path="dsaprep" element={<DsaProblems />} />

          {/* Interview Flow */}
          <Route path="interview/:interviewId" element={<InterviewDetails />} />
          <Route path="start-interview/:interviewId" element={<InterviewCard />} />
          <Route path="create-interview" element={<CreateInterview/>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
