import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-bg-secondary rounded ${className}`}></div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="p-md bg-bg-card border border-bg-secondary rounded-lg space-y-sm">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div className="space-y-sm">
      <div className="flex space-x-md">
        <Skeleton className="h-6 flex-1" />
        <Skeleton className="h-6 flex-1" />
        <Skeleton className="h-6 flex-1" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};
