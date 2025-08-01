import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';
import TrainingSchedulesPage from './pages/TrainingSchedulesPage';
import OptInOutPage from './pages/OptInOutPage';

import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  const { logoutUser, user } = useContext(AuthContext);

  // Check if user is a student
  const isStudent = user?.role === 'student' || user?.role === 'Student';

  return (
    <>
      <Router>
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">Training Platform</h1>
          {user ? (
            <div className="flex items-center space-x-6">
              <nav className="space-x-6">
                {!isStudent && (
                  <>
                    <NavLink to="/courses" className={({ isActive }) => isActive ? 'font-semibold underline' : ''}>Courses</NavLink>
                    <NavLink to="/students" className={({ isActive }) => isActive ? 'font-semibold underline' : ''}>Students</NavLink>
                    <NavLink to="/training-schedules" className={({ isActive }) => isActive ? 'font-semibold underline' : ''}>Training Schedules</NavLink>
                  </>
                )}
                <NavLink to="/opt-in-out" className={({ isActive }) => isActive ? 'font-semibold underline' : ''}>Opt In/Out</NavLink>
              </nav>
              
              {/* User info in top right corner */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={logoutUser}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </header>

        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 pt-10">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            {!isStudent && (
              <>
                <Route path="/courses" element={
                  <ProtectedRoute>
                    <CoursesPage />
                  </ProtectedRoute>
                } />
                <Route path="/students" element={
                  <ProtectedRoute>
                    <StudentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/training-schedules" element={
                  <ProtectedRoute>
                    <TrainingSchedulesPage />
                  </ProtectedRoute>
                } />
              </>
            )}

            <Route path="/opt-in-out" element={
              <ProtectedRoute>
                <OptInOutPage />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
