import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300',
    primary: 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400',
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',
    info: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-lg ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
