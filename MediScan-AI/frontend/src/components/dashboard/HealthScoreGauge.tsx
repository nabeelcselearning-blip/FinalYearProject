import React from 'react';

interface HealthScoreGaugeProps {
  score: number; // 0 to 100
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score }) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = '#10B981'; // Green
  if (score < 60) colorClass = '#EF4444'; // Red
  else if (score < 75) colorClass = '#F97316'; // Orange
  else if (score < 88) colorClass = '#F59E0B'; // Yellow

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl card-border relative">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={colorClass}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            {Math.round(score)}
          </span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
            / 100 Score
          </span>
        </div>
      </div>
      <div className="mt-3 text-center">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Overall Health Index
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Deterministic metabolic & laboratory rating
        </p>
      </div>
    </div>
  );
};
