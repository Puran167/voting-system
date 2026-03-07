import React from 'react';

const StatCard = ({ icon, label, value, trend, trendUp, color = 'primary', className = '' }) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    green: 'from-emerald-500 to-emerald-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div className={`bg-white dark:bg-surface-900 rounded-2xl p-5 border border-surface-200 dark:border-surface-800 hover:shadow-lg hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50 transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">{value}</p>
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              <span>{trendUp ? '↑' : '↓'}</span>
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color] || colors.primary} flex items-center justify-center text-white text-xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
