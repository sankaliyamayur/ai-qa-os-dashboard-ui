import React from 'react';

interface MetricBadgeProps {
  label: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ label }) => {
  return (
    <span className="inline-flex items-center px-sm py-[2px] rounded-md text-xs font-medium bg-bg-secondary text-text-muted border border-text-muted/20">
      {label}
    </span>
  );
};
