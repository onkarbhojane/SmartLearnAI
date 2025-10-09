import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Layout } from "../components/layout/Layout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { StudySession } from "../pages/StudySession/StudySession";
import { Documents } from "../pages/Documents/Documents";
import { Progress } from "../pages/Progress/Progress";
import { Login } from "../pages/Auth/Login";
import { Register } from "../pages/Auth/Register";
import Landing from "../pages/Landing/Landing";
import { ForgotPassword } from "../pages/Auth/ForgotPassword";
import { ResetPassword } from "../pages/Auth/ResetPassword";
import { Profile } from "../pages/Profile/Profile";
import { QuizzesPage } from "../pages/Quizes/QuizzesPage";
import { QuizAttempt } from "../components/quiz/QuizAttempt/QuizAttempt";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing Page - Public */}
      <Route path="/" element={<Landing />} />

      
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route 
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/quizzes/:documentId" element={<ProtectedRoute><Layout><QuizzesPage /></Layout></ProtectedRoute>} />
      <Route 
      path="/quiz/:documentId/:attemptId" 
      element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} 
      />

      <Route
        path="/study/:documentId"
        element={
          <ProtectedRoute>
            <Layout>
              <StudySession />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Layout>
              <Documents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <Documents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Layout>
              <Progress />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
