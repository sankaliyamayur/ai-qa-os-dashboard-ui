import React from 'react';

interface ChartProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

export const ChartContainer: React.FC<ChartProps> = ({ title, children, loading = false }) => {
  return (
    <div className="bg-bg-card border border-bg-secondary rounded-lg shadow-flat-md p-md flex flex-col h-[350px]">
      <h3 className="text-sm font-semibold text-text-main mb-sm">{title}</h3>
      <div className="flex-1 w-full relative min-h-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-card/50">
            <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
