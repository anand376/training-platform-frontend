// index.js or wherever you render App

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // your component below
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'; // your global styles

// Fix for ResizeObserver loop limit exceeded error
const originalError = console.error;
console.error = (...args) => {
  // Check for ResizeObserver errors in various formats
  const errorMessage = args[0];
  if (
    errorMessage &&
    typeof errorMessage === 'string' &&
    (errorMessage.includes('ResizeObserver loop limit exceeded') ||
     errorMessage.includes('ResizeObserver loop completed with undelivered notifications') ||
     errorMessage.includes('ResizeObserver'))
  ) {
    // Suppress ResizeObserver loop errors
    return;
  }
  
  // Also check for errors in the stack trace
  if (args.length > 1 && args[1] && typeof args[1] === 'string' && args[1].includes('ResizeObserver')) {
    return;
  }
  
  originalError.apply(console, args);
};

// Additional fix for unhandled promise rejections related to ResizeObserver
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && typeof event.reason === 'string' && event.reason.includes('ResizeObserver')) {
    event.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>
);
