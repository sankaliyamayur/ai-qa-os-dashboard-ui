import React from 'react';

interface ErrorPageProps {
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message = 'Something Went Wrong' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-main p-md">
      <h1 className="text-4xl font-bold text-status-error mb-sm">500</h1>
      <p className="text-lg text-text-muted mb-md">{message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-md py-sm bg-accent-primary text-white rounded-md hover:bg-accent-hover transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
};
