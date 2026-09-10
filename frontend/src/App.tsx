import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { XPNotification } from './components/XPNotification';

// Pages
import PlacementTest from "./pages/PlacementTest";
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { LessonPage } from './pages/LessonPage';
import { Hiragana } from './pages/Hiragana';
import { Katakana } from './pages/Katakana';
import { Vocabulary } from './pages/Vocabulary';
import { Kanji } from './pages/Kanji';
import { Grammar } from './pages/Grammar';
import { VerbTrainer } from './pages/VerbTrainer';
import { Flashcards } from './pages/Flashcards';
import { Listening } from './pages/Listening';
import { Reading } from './pages/Reading';
import { Speaking } from './pages/Speaking';
import { JLPTPrep } from './pages/JLPTPrep';
import { MockExam } from './pages/MockExam';
import { ExamResultPage } from './pages/ExamResultPage';
import { MistakesReview } from './pages/MistakesReview';
import { Achievements } from './pages/Achievements';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Dictionary } from './pages/Dictionary';
import { ResourceLibrary } from './pages/ResourceLibrary';
import { AdminDashboard } from './pages/AdminDashboard';
import { AITutorPage } from './pages/AITutorPage';
import Mission from './pages/Mission';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading user session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col">
      <Navbar />
      <XPNotification />

      <div className="flex flex-1">
        {user && <Sidebar />}

        <main className="flex-1 min-w-0 overflow-y-auto bg-[#050816]">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />

            {/* Placement Test */}
            <Route
              path="/placement-test"
              element={
                <ProtectedRoute>
                  <PlacementTest />
                </ProtectedRoute>
              }
            />

            {/* Main Pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mission/:missionId"
              element={
                <ProtectedRoute>
                  <Mission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lesson/:lessonId"
              element={
                <ProtectedRoute>
                  <LessonPage />
                </ProtectedRoute>
              }
            />

            {/* Japanese Learning */}
            <Route
              path="/hiragana"
              element={
                <ProtectedRoute>
                  <Hiragana />
                </ProtectedRoute>
              }
            />

            <Route
              path="/katakana"
              element={
                <ProtectedRoute>
                  <Katakana />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vocabulary"
              element={
                <ProtectedRoute>
                  <Vocabulary />
                </ProtectedRoute>
              }
            />

            <Route
              path="/kanji"
              element={
                <ProtectedRoute>
                  <Kanji />
                </ProtectedRoute>
              }
            />

            <Route
              path="/grammar"
              element={
                <ProtectedRoute>
                  <Grammar />
                </ProtectedRoute>
              }
            />

            <Route
              path="/verbs"
              element={
                <ProtectedRoute>
                  <VerbTrainer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              }
            />

            <Route
              path="/listening"
              element={
                <ProtectedRoute>
                  <Listening />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reading"
              element={
                <ProtectedRoute>
                  <Reading />
                </ProtectedRoute>
              }
            />

            <Route
              path="/speaking"
              element={
                <ProtectedRoute>
                  <Speaking />
                </ProtectedRoute>
              }
            />

            {/* JLPT */}
            <Route
              path="/jlpt"
              element={
                <ProtectedRoute>
                  <JLPTPrep />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exam/:examId"
              element={
                <ProtectedRoute>
                  <MockExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exam-result/:resultId"
              element={
                <ProtectedRoute>
                  <ExamResultPage />
                </ProtectedRoute>
              }
            />

            {/* Progress */}
            <Route
              path="/mistakes"
              element={
                <ProtectedRoute>
                  <MistakesReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            {/* User */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dictionary"
              element={
                <ProtectedRoute>
                  <Dictionary />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <ResourceLibrary />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* AI Tutor */}
            <Route
              path="/ai-tutor"
              element={
                <ProtectedRoute>
                  <AITutorPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <GamificationProvider>
          <AppContent />
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}