import React, { useContext, useState, useEffect } from 'react';
import api from '../services/api';
import CourseCRUD from '../components/CourseCRUD';
import StudentCRUD from '../components/StudentCRUD';
import TrainingScheduleCRUD from '../components/TrainingScheduleCRUD';
import OptInOut from '../components/OptInOut';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalTrainings: 0
  });
  const [loading, setLoading] = useState(true);

  const isStudent = user?.role === 'student' || user?.role === 'Student';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesRes, studentsRes, trainingsRes] = await Promise.all([
          api.get('/courses'),
          api.get('/students'),
          api.get('/training-schedules')
        ]);

        setStats({
          totalCourses: coursesRes.data.length,
          totalStudents: studentsRes.data.length,
          totalTrainings: trainingsRes.data.length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 flex items-center justify-between ${color}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold mt-2">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
          ) : (
            value
          )}
        </p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
        
        {/* Statistics Cards */}
         {!isStudent ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            color="border-blue-500"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            color="border-green-500"
          />
          <StatCard
            title="Total Trainings"
            value={stats.totalTrainings}
            icon={
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            color="border-purple-500"
          />
        </div>
         ):("")}

        {isStudent ? (
          // Student Dashboard
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Student Dashboard</h2>
            <OptInOut />
          </div>
        ) : (
          // Admin Dashboard
          <div className="space-y-8">
            {/* Course Management */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Course Management</h2>
              </div>
              <div className="p-6">
                <CourseCRUD />
              </div>
            </div>

            {/* Student Management */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-green-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Student Management</h2>
              </div>
              <div className="p-6">
                <StudentCRUD />
              </div>
            </div>

            {/* Training Schedule Management */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-purple-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Training Schedule Management</h2>
              </div>
              <div className="p-6">
                <TrainingScheduleCRUD />
              </div>
            </div>

            {/* Opt In/Out Management */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-orange-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Opt In/Out Management</h2>
              </div>
              <div className="p-6">
                <OptInOut />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}