import React from 'react';
import TrainingScheduleCRUD from '../components/TrainingScheduleCRUD';

export default function TrainingSchedulesPage() {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Training Schedules</h2>
      <TrainingScheduleCRUD />
    </div>
  );
}
