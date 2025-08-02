import React, { useEffect, useState } from 'react';
import api from '../services/api';

function StudentCRUD() {
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [editForm, setEditForm] = useState({
    name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');

  // Fetch students with linked user info
  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(() => setError('Failed to load students'));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Password and confirmation do not match.');
      return;
    }

    try {
      // Post combined form data to your API (registration endpoint)
      // Assuming backend expects: name, email, password, password_confirmation, first_name, last_name, phone
      const res = await api.post('/students', form); // Adjust path if registration is elsewhere

      setStudents(prev => [...prev, res.data.student || res.data]); 
      // res.data.student if your API returns nested 'student', else adjust accordingly
      setForm({
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
      });
    } catch (err) {
      // Better error parsing if available
      const msg = err.response?.data?.message || 'Creation failed';
      setError(msg);
    }
  };

  const handleEdit = (student) => {
    if (!student || !student.id) {
      setError('Invalid student data for editing');
      return;
    }

    console.log('Student data:', student);
    
    setEditingId(student.id);
    setEditForm({
      name: student.name || student.user?.name || '',
      first_name: student.first_name || '',
      last_name: student.last_name || '',
      email: student.email || student.user?.email || '',
      phone: student.phone || '',
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/students/${id}`, editForm);
      
      // Handle different response structures and null checks
      const updatedStudent = res.data?.student || res.data;
      
      if (updatedStudent && updatedStudent.id) {
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
        setEditingId(null);
        setEditForm({
          name: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });
      } else {
        // If response doesn't contain student data, refresh the list
        const refreshRes = await api.get('/students');
        setStudents(refreshRes.data);
        setEditingId(null);
        setEditForm({
          name: '',
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      const msg = err.response?.data?.message || 'Update failed';
      setError(msg);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    });
  };

  const handleDelete = async id => {
    try {
      // Delete student - Remember backend might require deleting linked user also
      await api.delete(`/students/${id}`);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch {
      setError('Failed to delete student');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto my-6">
      <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">Students</h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
        <label className="font-semibold">
          User Name
          <input
            name="name"
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="font-semibold">
          First Name
          <input
            name="first_name"
            placeholder="e.g. John"
            value={form.first_name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="font-semibold">
          Last Name
          <input
            name="last_name"
            placeholder="e.g. Doe"
            value={form.last_name}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="font-semibold">
          Email
          <input
            name="email"
            type="email"
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="font-semibold">
          Password
          <input
            name="password"
            type="password"
            placeholder="e.g. StrongPassword123"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="font-semibold">
          Confirm Password
          <input
            name="password_confirmation"
            type="password"
            placeholder="Re-enter password"
            value={form.password_confirmation}
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="font-semibold">
          Phone
          <input
            name="phone"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={handleChange}
            maxLength={10}
            pattern="\d{10}"
            title="Phone number must be 10 digits"
            className="mt-1 w-full px-3 py-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="mt-2 bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          Add Student
        </button>
      </form>

      {error && <p className="text-red-600 mb-4 text-center font-medium">{error}</p>}

      <ul className="space-y-3">
        {students.length === 0 ? (
          <li className="text-center text-gray-500">No students found.</li>
        ) : (
          students.map((s) => {
            if (!s || !s.id) return null; // Skip invalid student data
            
            return (
              <li
                key={s.id}
                className="flex items-center justify-between p-3 bg-green-50 rounded ring-1 ring-green-100"
              >
                {editingId === s.id ? (
                  // Edit form
                  <div className="flex-1 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        name="name"
                        placeholder="User Name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <input
                        name="email"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <input
                        name="first_name"
                        placeholder="First Name"
                        value={editForm.first_name}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <input
                        name="last_name"
                        placeholder="Last Name"
                        value={editForm.last_name}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded text-sm"
                      />
                      <input
                        name="phone"
                        placeholder="Phone"
                        value={editForm.phone}
                        onChange={handleEditChange}
                        className="px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(s.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <>
                    <span className="flex-1 font-medium text-green-800">
                      {/* Adapt display for linked user data */}
                      {s.first_name} {s.last_name} ({s.user?.email || s.email || 'No email'})
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
                  </>
                )}
              </li>
            );
          }).filter(Boolean) // Remove null items
        )}
      </ul>
    </div>
  );
}

export default StudentCRUD;
