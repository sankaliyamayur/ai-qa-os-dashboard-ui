import React from 'react';

interface BadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<BadgeProps> = ({ type, children }) => {
  const styles = {
    success: 'bg-status-success/15 text-status-success border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    error: 'bg-status-error/15 text-status-error border-status-error/30',
    info: 'bg-status-info/15 text-status-info border-status-info/30',
  };

  return (
    <span className={`inline-flex items-center px-sm py-[2px] rounded-sm text-xs font-semibold border ${styles[type]}`}>
      {children}
    </span>
  );
};
