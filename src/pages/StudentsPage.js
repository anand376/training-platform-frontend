import React from 'react';
import StudentCRUD from '../components/StudentCRUD';

export default function StudentsPage() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Students</h2>
      <StudentCRUD />
    </div>
  );
}
