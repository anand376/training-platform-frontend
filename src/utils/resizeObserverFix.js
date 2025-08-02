// Fix for ResizeObserver loop limit exceeded error
// This is a common issue with certain React components that use ResizeObserver

const resizeObserverErrorHandler = () => {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('ResizeObserver loop limit exceeded') ||
       args[0].includes('ResizeObserver loop completed with undelivered notifications'))
    ) {
      // Suppress ResizeObserver loop errors
      return;
    }
    originalError.apply(console, args);
  };
};

export default resizeObserverErrorHandler; 