import React from 'react';

const steps = [
  { key: 'fingerprint', icon: '🔐', label: 'Fingerprint' },
  { key: 'photo', icon: '📸', label: 'Photo' },
  { key: 'vote', icon: '🗳️', label: 'Cast Vote' },
  { key: 'receipt', icon: '📄', label: 'Receipt' },
];

const StepProgress = ({ currentStep, completedSteps = {} }) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps[step.key] || index < currentIndex;
          const isCurrent = step.key === currentStep;

          return (
            <React.Fragment key={step.key}>
              {/* Step circle */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-primary-100 dark:bg-primary-500/20 border-primary-500 text-primary-600 dark:text-primary-400 ring-4 ring-primary-100 dark:ring-primary-500/10'
                      : 'bg-surface-100 dark:bg-surface-800 border-surface-300 dark:border-surface-700 text-surface-400'
                  }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                <span
                  className={`mt-1.5 text-[11px] font-semibold text-center leading-tight ${
                    isCompleted
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : isCurrent
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-400 dark:text-surface-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mt-[-18px]">
                  <div
                    className={`h-0.5 w-full rounded transition-all duration-300 ${
                      isCompleted
                        ? 'bg-emerald-500'
                        : 'bg-surface-200 dark:bg-surface-700'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
