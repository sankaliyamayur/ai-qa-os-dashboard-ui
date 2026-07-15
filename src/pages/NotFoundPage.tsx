import React from 'react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-main p-md">
      <h1 className="text-4xl font-bold text-accent-primary mb-sm">404</h1>
      <p className="text-lg text-text-muted mb-md">Page Not Found</p>
      <a href="/dashboard" className="px-md py-sm bg-accent-primary text-white rounded-md hover:bg-accent-hover transition-colors">
        Go to Dashboard
      </a>
    </div>
  );
};
