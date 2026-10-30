
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FeaturePreviewPage from './pages/FeaturePreviewPage';

import Dashboard from './pages/Dashboard';
import DiscussionsPage from './pages/DiscussionsPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import AiAssistantPage from './pages/AiAssistantPage';
import MissionsPage from './pages/MissionsPage';
import ProfilePage from './pages/ProfilePage';

import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Public Feature Previews */}
      <Route
        path="/preview/:feature"
        element={<FeaturePreviewPage />}
      />

      {/* Dashboard */}
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

      {/* Discussions List */}
      <Route
        path="/discussions"
        element={
          <ProtectedRoute>
            <Layout>
              <DiscussionsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Individual Discussion Details */}
      <Route
        path="/discussions/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <DiscussionDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* AI Assistant */}
      <Route
        path="/ai-assistant"
        element={
          <ProtectedRoute>
            <Layout>
              <AiAssistantPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Missions */}
      <Route
        path="/missions"
        element={
          <ProtectedRoute>
            <Layout>
              <MissionsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
