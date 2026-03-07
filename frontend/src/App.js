import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Voter pages
import VoterDashboard from './pages/voter/VoterDashboard';
import OtpVerification from './pages/voter/OtpVerification';
import FingerprintVerification from './pages/voter/FingerprintVerification';
import VotingPage from './pages/voter/VotingPage';
import PhotoCapturePage from './pages/voter/PhotoCapturePage';
import VoteSuccess from './pages/voter/VoteSuccess';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageVoters from './pages/admin/ManageVoters';
import ManageCandidates from './pages/admin/ManageCandidates';
import VotingTimeSettings from './pages/admin/VotingTimeSettings';
import ResultsDashboard from './pages/admin/ResultsDashboard';
import ActivityLogs from './pages/admin/ActivityLogs';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Wrap authenticated pages in DashboardLayout
const DashboardRoute = ({ children, role }) => (
  <ProtectedRoute role={role}>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes (no layout) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Voter routes (with dashboard layout) */}
            <Route path="/voter" element={<DashboardRoute role="voter"><VoterDashboard /></DashboardRoute>} />
            <Route path="/voter/verify-otp" element={<DashboardRoute role="voter"><OtpVerification /></DashboardRoute>} />
            <Route path="/voter/verify" element={<DashboardRoute role="voter"><FingerprintVerification /></DashboardRoute>} />
            <Route path="/voter/capture-photo" element={<DashboardRoute role="voter"><PhotoCapturePage /></DashboardRoute>} />
            <Route path="/voter/vote" element={<DashboardRoute role="voter"><VotingPage /></DashboardRoute>} />
            <Route path="/voter/success" element={<DashboardRoute role="voter"><VoteSuccess /></DashboardRoute>} />

            {/* Admin routes (with dashboard layout) */}
            <Route path="/admin" element={<DashboardRoute role="admin"><AdminDashboard /></DashboardRoute>} />
            <Route path="/admin/voters" element={<DashboardRoute role="admin"><ManageVoters /></DashboardRoute>} />
            <Route path="/admin/candidates" element={<DashboardRoute role="admin"><ManageCandidates /></DashboardRoute>} />
            <Route path="/admin/voting-time" element={<DashboardRoute role="admin"><VotingTimeSettings /></DashboardRoute>} />
            <Route path="/admin/results" element={<DashboardRoute role="admin"><ResultsDashboard /></DashboardRoute>} />
            <Route path="/admin/logs" element={<DashboardRoute role="admin"><ActivityLogs /></DashboardRoute>} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
