import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import resizeObserverErrorHandler from './utils/resizeObserverFix';

import Dashboard from './pages/Dashboard';
import CoursesPage from './pages/CoursesPage';
import StudentsPage from './pages/StudentsPage';
import TrainingSchedulesPage from './pages/TrainingSchedulesPage';
import OptInOutPage from './pages/OptInOutPage';

import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
        <span className="ml-4 text-blue-700 font-semibold">Loading...</span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  const { logoutUser, user } = useContext(AuthContext);

  // Apply ResizeObserver error fix
  useEffect(() => {
    resizeObserverErrorHandler();
  }, []);

  // Check if user is a student
  const isStudent = user?.role === 'student' || user?.role === 'Student';

  return (
    <>
      <Router>
        <header className="bg-white shadow-lg p-4 flex justify-between items-center border-b border-blue-100">
          <h1 className="text-2xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Training Platform
          </h1>
          {user ? (
            <div className="flex items-center gap-8">
              <nav className="flex gap-6">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'font-semibold underline text-blue-700' : 'hover:text-blue-500 transition'}>Dashboard</NavLink>
                {!isStudent && (
                  <>
                    <NavLink to="/courses" className={({ isActive }) => isActive ? 'font-semibold underline text-blue-700' : 'hover:text-blue-500 transition'}>Courses</NavLink>
                    <NavLink to="/students" className={({ isActive }) => isActive ? 'font-semibold underline text-blue-700' : 'hover:text-blue-500 transition'}>Students</NavLink>
                    <NavLink to="/training-schedules" className={({ isActive }) => isActive ? 'font-semibold underline text-blue-700' : 'hover:text-blue-500 transition'}>Training Schedules</NavLink>
                  </>
                )}
                <NavLink to="/opt-in-out" className={({ isActive }) => isActive ? 'font-semibold underline text-blue-700' : 'hover:text-blue-500 transition'}>Opt In/Out</NavLink>
              </nav>

              {/* User info in top right corner */}
              <div className="relative flex items-center gap-3 bg-gradient-to-r from-blue-50 to-pink-50 px-4 py-2 rounded-xl shadow border border-blue-100">
                {/* Avatar with initials */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg uppercase shadow hover:scale-105 transition-transform cursor-pointer ring-2 ring-blue-300">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold text-gray-900">{user.name}</div>
                  <div className="text-xs text-blue-500 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={logoutUser}
                  className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1 rounded-lg shadow hover:from-red-600 hover:to-pink-600 transition text-sm font-semibold"
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
