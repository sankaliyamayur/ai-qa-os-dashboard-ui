import React from 'react';

interface MockProps {
  title: string;
}

export const MockPage: React.FC<MockProps> = ({ title }) => {
  return (
    <div className="p-lg bg-bg-card text-text-main shadow-flat-md rounded-lg">
      <h2 className="text-2xl font-bold mb-md text-accent-primary">{title}</h2>
      <p className="text-text-muted">This page is a placeholder for {title} feature.</p>
    </div>
  );
};
