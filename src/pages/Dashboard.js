import React, { useContext } from 'react';

import CourseCRUD from '../components/CourseCRUD';
import StudentCRUD from '../components/StudentCRUD';
import TrainingScheduleCRUD from '../components/TrainingScheduleCRUD';
import OptInOut from '../components/OptInOut';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { logoutUser, user } = useContext(AuthContext);

  // Check if user is a student (assuming role is stored in user object)
  const isStudent = user?.role === 'student' || user?.role === 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <div className="max-w-5xl mx-auto py-10 relative">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-blue-700 underline underline-offset-8">
          Training Platform Dashboard
        </h1>

        {/* Logout button top-right */}
        <button
          onClick={logoutUser}
          className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          aria-label="Logout"
          type="button"
        >
          Logout
        </button>

        {isStudent ? (
          // Show only OptInOut for students
          <div className="grid grid-cols-1 gap-8">
            <section className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-2xl duration-300">
              <OptInOut />
            </section>
          </div>
        ) : (
          // Show all CRUD components for admin/instructor
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-2xl duration-300">
              <CourseCRUD />
            </section>
            <section className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-2xl duration-300">
              <StudentCRUD />
            </section>
            <section className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-orange-500 hover:shadow-2xl duration-300">
              <TrainingScheduleCRUD />
            </section>
            <section className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-2xl duration-300">
              <OptInOut />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
