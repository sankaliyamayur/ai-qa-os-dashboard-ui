import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
}) => {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md p-md hover:shadow-flat-lg transition-shadow duration-standard flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl font-bold text-text-main mt-xs">{value}</h3>
        </div>
        {icon && <div className="p-xs bg-bg-secondary rounded-md text-accent-primary">{icon}</div>}
      </div>
      {(description || trend) && (
        <div className="mt-md flex items-center text-xs">
          {trend && (
            <span
              className={`font-semibold mr-xs ${
                trend.isPositive ? 'text-status-success' : 'text-status-error'
              }`}
            >
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          )}
          {description && <span className="text-text-muted">{description}</span>}
        </div>
      )}
    </div>
  );
};
