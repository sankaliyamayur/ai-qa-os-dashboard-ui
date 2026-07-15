import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const WidgetCard: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md p-md hover:shadow-flat-lg transition-shadow duration-standard ${className}`}>
      {children}
    </div>
  );
};
