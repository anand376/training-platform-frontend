import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

function OptInOut() {
  const { user } = useContext(AuthContext);
  const [schedules, setSchedules] = useState([]);
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState({});
  const [message, setMessage] = useState('');
  const [studentId, setStudentId] = useState(null);
  const [loadingScheduleId, setLoadingScheduleId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    // Check if user is admin
    const adminRole = user.role === 'admin';
    setIsAdmin(adminRole);

    if (adminRole) {
      // Admin view: load all students and schedules
      Promise.all([
        api.get('/students'),
        api.get('/training-schedules')
      ]).then(([studentsRes, schedulesRes]) => {
        setStudents(studentsRes.data);
        setSchedules(schedulesRes.data);
      }).catch(() => setMessage('Failed to load data'));
    } else {
      // Student view: find student by email and load schedules
      api.get('/students')
        .then(res => {
          const matchedStudent = res.data.find(student => student.email === user.email);
          if (matchedStudent) {
            setStudentId(matchedStudent.id);
            setSelectedStudent(matchedStudent);
          } else {
            setMessage('No corresponding student record found for the logged-in user.');
          }
        })
        .catch(() => setMessage('Failed to load student info'));

      api.get('/training-schedules')
        .then(res => setSchedules(res.data))
        .catch(() => setMessage('Failed to load schedules'));
    }
  }, [user]);

  // Fetch existing opt-in/out statuses
  useEffect(() => {
    if (!studentId && !selectedStudent) return;

    const targetStudentId = selectedStudent?.id || studentId;
    
    api.get(`/student-training-statuses?student_id=${targetStudentId}`)
      .then(res => {
        const statusMap = {};
        res.data.forEach(item => {
          statusMap[item.training_schedule_id] = item.status;
        });
        setStatus(statusMap);
        setLastUpdated(new Date());
      })
      .catch(() => setMessage('Failed to load training opt-in/out statuses'));
  }, [studentId, selectedStudent]);

  const handleChange = async (scheduleId, newStatus, targetStudentId = null) => {
    setMessage('');
    const studentToUpdate = targetStudentId || studentId || selectedStudent?.id;
    
    if (!studentToUpdate) {
      setMessage('Student ID not found. Cannot update training status.');
      return;
    }

    setLoadingScheduleId(scheduleId);

    try {
      await api.post('/training-opt-in-out', {
        student_id: studentToUpdate,
        training_schedule_id: scheduleId,
        status: newStatus,
      });
      setStatus(prev => ({ ...prev, [scheduleId]: newStatus }));
      setLastUpdated(new Date());
      setMessage('Status updated!');
    } catch (err) {
      setMessage('Update failed');
    } finally {
      setLoadingScheduleId(null);
    }
  };

  const handleStudentChange = (studentId) => {
    const student = students.find(s => s.id === parseInt(studentId));
    setSelectedStudent(student);
    setStatus({}); // Clear status to reload for new student
  };

  const refreshStatus = () => {
    if (!studentId && !selectedStudent) return;
    
    const targetStudentId = selectedStudent?.id || studentId;
    
    api.get(`/student-training-statuses?student_id=${targetStudentId}`)
      .then(res => {
        const statusMap = {};
        res.data.forEach(item => {
          statusMap[item.training_schedule_id] = item.status;
        });
        setStatus(statusMap);
        setLastUpdated(new Date());
        setMessage('Status refreshed!');
      })
      .catch(() => setMessage('Failed to refresh status'));
  };

  if (isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-6">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Admin: Manage Student Training Status</h3>

        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.toLowerCase().includes('failed') || message.toLowerCase().includes('no')
                ? 'text-red-600'
                : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Student
          </label>
          <select
            value={selectedStudent?.id || ''}
            onChange={(e) => handleStudentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">-- Select a student --</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">
              Managing status for: {selectedStudent.name} ({selectedStudent.email})
            </h4>
            {lastUpdated && (
              <p className="text-sm text-blue-600 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        <ul className="space-y-4">
          {schedules.length === 0 && (
            <li className="text-center text-gray-500">No training schedules available.</li>
          )}

          {schedules.map(s => (
            <li
              key={s.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-4 rounded shadow-sm"
            >
              <div className="mb-3 md:mb-0 text-gray-900 font-medium text-lg">
                {s.course?.name || 'Course'}: {new Date(s.start_date).toLocaleDateString()} to{' '}
                {new Date(s.end_date).toLocaleDateString()}
                {s.location && ` (${s.location})`}
                {status[s.id] && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    status[s.id] === 'opt-in' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {status[s.id] === 'opt-in' ? '✓ Opted In' : '✗ Opted Out'}
                  </span>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleChange(s.id, 'opt-in', selectedStudent?.id)}
                  disabled={loadingScheduleId === s.id || status[s.id] === 'opt-in' || !selectedStudent}
                  className={`px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    status[s.id] === 'opt-in'
                      ? 'bg-green-300 cursor-not-allowed text-green-700'
                      : selectedStudent
                      ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                      : 'bg-gray-400 cursor-not-allowed text-gray-600'
                  }`}
                >
                  Opt-In
                </button>
                <button
                  onClick={() => handleChange(s.id, 'opt-out', selectedStudent?.id)}
                  disabled={loadingScheduleId === s.id || status[s.id] === 'opt-out' || !selectedStudent}
                  className={`px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    status[s.id] === 'opt-out'
                      ? 'bg-red-300 cursor-not-allowed text-red-700'
                      : selectedStudent
                      ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                      : 'bg-gray-400 cursor-not-allowed text-gray-600'
                  }`}
                >
                  Opt-Out
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Student view (existing functionality)
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto my-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">My Training Schedules</h3>
        <button
          onClick={refreshStatus}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
        >
          Refresh Status
        </button>
      </div>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.toLowerCase().includes('failed') || message.toLowerCase().includes('no')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}

      {lastUpdated && (
        <p className="text-sm text-gray-600 mb-4 text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      <ul className="space-y-4">
        {schedules.length === 0 && (
          <li className="text-center text-gray-500">No training schedules available.</li>
        )}

        {schedules.map(s => (
          <li
            key={s.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 p-4 rounded shadow-sm"
          >
            <div className="mb-3 md:mb-0 text-gray-900 font-medium text-lg">
              {s.course?.name || 'Course'}: {new Date(s.start_date).toLocaleDateString()} to{' '}
              {new Date(s.end_date).toLocaleDateString()}
              {status[s.id] && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  status[s.id] === 'opt-in' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status[s.id] === 'opt-in' ? '✓ Opted In' : '✗ Opted Out'}
                </span>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleChange(s.id, 'opt-in')}
                disabled={loadingScheduleId === s.id || status[s.id] === 'opt-in'}
                className={`px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  status[s.id] === 'opt-in'
                    ? 'bg-green-300 cursor-not-allowed text-green-700'
                    : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                }`}
              >
                Opt-In
              </button>
              <button
                onClick={() => handleChange(s.id, 'opt-out')}
                disabled={loadingScheduleId === s.id || status[s.id] === 'opt-out'}
                className={`px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                  status[s.id] === 'opt-out'
                    ? 'bg-red-300 cursor-not-allowed text-red-700'
                    : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                }`}
              >
                Opt-Out
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OptInOut;
