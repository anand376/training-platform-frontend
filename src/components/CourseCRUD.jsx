import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CourseCRUD() {
  const [form, setForm] = useState({ name: '', description: '', duration: '' });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null); // Track which course is being edited

  useEffect(() => {
    api.get('/courses')
      .then(res => setCourses(res.data))
      .catch(() => setError('Failed to load courses'));
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ name: '', description: '', duration: '' });
    setEditId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      if (editId === null) {
        // Create new course
        const res = await api.post('/courses', form);
        setCourses(prev => [...prev, res.data]);
      } else {
        // Update existing course
        const res = await api.put(`/courses/${editId}`, form);
        setCourses(prev => prev.map(c => (c.id === editId ? res.data : c)));
      }
      resetForm();
    } catch {
      setError(editId === null ? 'Failed to add course' : 'Failed to update course');
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
      // If you delete a course that's being edited, reset form
      if (editId === id) resetForm();
    } catch {
      setError('Failed to delete course');
    }
  };

  const handleEdit = course => {
    setEditId(course.id);
    setForm({
      name: course.name,
      description: course.description || '',
      duration: course.duration.toString(),
    });
    setError('');
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
        <label className="font-semibold">
          Course Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400"
            placeholder="Course name"
          />
        </label>
        <label className="font-semibold">
          Description
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded"
            placeholder="Short description"
          />
        </label>
        <label className="font-semibold">
          Duration (days)
          <input
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded"
            placeholder="e.g. 5"
            min="1"
          />
        </label>

        <div>
          <button
            type="submit"
            className={`mt-2 mr-2 px-4 py-2 rounded text-white font-semibold 
              ${editId === null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} 
              transition`}
          >
            {editId === null ? 'Add Course' : 'Update Course'}
          </button>

          {editId !== null && (
            <button
              type="button"
              onClick={handleCancel}
              className="mt-2 px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-2">
        {courses.map(c => (
          <li key={c.id} className="flex items-center justify-between p-3 bg-blue-50 rounded ring-1 ring-blue-100">
            <span className="flex-1 font-medium text-blue-800">
              {c.name} – {c.duration} days
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
