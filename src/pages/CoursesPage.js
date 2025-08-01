import React from 'react';
import CourseCRUD from '../components/CourseCRUD';

export default function CoursesPage() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Courses</h2>
      <CourseCRUD />
    </div>
  );
}
