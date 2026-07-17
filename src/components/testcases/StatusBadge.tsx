import React from 'react';

interface StatusBadgeProps {
  status: 'Passed' | 'Failed' | 'Skipped' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Passed':
      case 'PASSED':
      case 'PASS':
      case 'success':
        return 'bg-status-success/15 text-status-success border-status-success/30';
      case 'Failed':
      case 'FAILED':
      case 'error':
        return 'bg-status-error/15 text-status-error border-status-error/30';
      case 'Skipped':
      case 'SKIPPED':
      case 'warning':
        return 'bg-status-warning/15 text-status-warning border-status-warning/30';
      default:
        return 'bg-status-info/15 text-status-info border-status-info/30';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getStyles()}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default StatusBadge;
