import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-slate-800/50";
  const variantClasses = {
    text: "h-4 w-full rounded",
    rect: "h-32 w-full rounded-2xl",
    circle: "h-12 w-12 rounded-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const BlueprintSkeleton = () => (
  <div className="space-y-10 p-10">
    <Skeleton className="h-64 rounded-[3rem]" />
    <div className="flex gap-4">
      {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-32 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="h-80 rounded-[2rem]" />
      <Skeleton className="h-80 rounded-[2rem]" />
    </div>
  </div>
);
