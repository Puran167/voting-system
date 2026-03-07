import React from 'react';
import { useTranslation } from 'react-i18next';

const CandidateCard = ({ candidate, onSelect, selectable, showVotes, disabled }) => {
  const { t } = useTranslation();
  const photoUrl = candidate.photo
    ? `http://localhost:5000${candidate.photo}`
    : null;

  return (
    <div className={`bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden transition-all duration-200 ${selectable && !disabled ? 'hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-500/30 cursor-pointer hover:-translate-y-1' : ''} ${disabled ? 'opacity-60' : ''}`}>
      <div className="aspect-square bg-white dark:bg-surface-800 flex items-center justify-center p-3 border-b border-surface-200 dark:border-surface-800">
        {photoUrl ? (
          <img src={photoUrl} alt={candidate.name} className="w-full h-full object-contain rounded-xl" />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-500/20 dark:to-purple-500/20 flex items-center justify-center">
            <span className="text-6xl">👤</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-surface-900 dark:text-white text-lg">{candidate.name}</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{candidate.party}</p>
        {showVotes && (
          <span className="mt-2 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400">
            {t('voting.votes', { count: candidate.votes })}
          </span>
        )}
        {selectable && (
          <button
            onClick={() => onSelect(candidate)}
            disabled={disabled}
            className="mt-4 w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-600"
          >
            {disabled ? t('voting.votingClosedBtn') : t('voting.castVoteBtn')}
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
