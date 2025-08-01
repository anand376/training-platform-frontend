// index.js or wherever you render App

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // your component below
import { AuthProvider } from './contexts/AuthContext';
import './index.css'; // your global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
