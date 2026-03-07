import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-pulse bg-surface-200 dark:bg-surface-800 rounded-xl';

  if (variant === 'circle') {
    return <div className={`${base} rounded-full ${className}`} />;
  }

  return <div className={`${base} ${className}`} />;
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800">
    <div className="flex items-start justify-between">
      <div className="space-y-3 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton variant="circle" className="w-12 h-12" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    <Skeleton className="h-10 w-full" />
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-14 w-full" />
    ))}
  </div>
);

export { Skeleton, SkeletonCard, SkeletonTable };
export default Skeleton;
