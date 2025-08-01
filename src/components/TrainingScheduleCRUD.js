import React, { useEffect, useState } from 'react';
import api from '../services/api';

function TrainingScheduleCRUD() {
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_id: '',
    start_date: '',
    end_date: '',
    location: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/training-schedules')
      .then(res => setSchedules(res.data))
      .catch(() => setError('Failed to load training schedules'));
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses'));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (editMode) {
        const res = await api.put(`/training-schedules/${editingId}`, form);
        setSchedules(prev => prev.map(s => s.id === editingId ? res.data : s));
        setEditMode(false);
        setEditingId(null);
      } else {
        const res = await api.post('/training-schedules', form);
        setSchedules(prev => [...prev, res.data]);
      }
      setForm({ course_id: '', start_date: '', end_date: '', location: '' });
    } catch {
      setError(editMode ? 'Update failed' : 'Creation failed');
    }
  };

  const handleEdit = (schedule) => {
    setEditMode(true);
    setEditingId(schedule.id);
    setForm({
      course_id: schedule.course_id || '',
      start_date: schedule.start_date ? schedule.start_date.split('T')[0] : '',
      end_date: schedule.end_date ? schedule.end_date.split('T')[0] : '',
      location: schedule.location || '',
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditingId(null);
    setForm({ course_id: '', start_date: '', end_date: '', location: '' });
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/training-schedules/${id}`);
      setSchedules(prev => prev.filter(s => s.id !== id));
    } catch {
      setError('Failed to delete schedule');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto my-6">
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {editMode ? 'Edit Training Schedule' : 'Training Schedules'}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-50 p-5 rounded-lg shadow-sm mb-6">
        <label className="font-semibold">
          Course
          <select
            name="course_id"
            value={form.course_id}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Select Course --</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className="font-semibold">
          Start Date
          <input
            name="start_date"
            type="date"
            value={form.start_date}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        <label className="font-semibold">
          End Date
          <input
            name="end_date"
            type="date"
            value={form.end_date}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-400"
          />
        </label>

        <label className="font-semibold">
          Location
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition"
          >
            {editMode ? 'Update Schedule' : 'Add Schedule'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

      <ul className="space-y-3">
        {schedules.length === 0 ? (
          <li className="text-center text-gray-500">No training schedules found.</li>
        ) : (
          schedules.map(s => (
            <li
              key={s.id}
              className="flex items-center justify-between p-3 bg-indigo-50 rounded ring-1 ring-indigo-100"
            >
              <span className="flex-1 font-medium text-indigo-800">
                {s.course?.name || 'Course'}: {new Date(s.start_date).toLocaleDateString()} to{' '}
                {new Date(s.end_date).toLocaleDateString()} {s.location ? `(${s.location})` : ''}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TrainingScheduleCRUD;
