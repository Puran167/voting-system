import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getVotingStatus } from '../../services/api';

const VoterDashboard = () => {
  const { user } = useAuth();
  const [electionStatus, setElectionStatus] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getVotingStatus();
        setElectionStatus(res.data);
      } catch {
        // Silently fail
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t('dashboard.welcome', { name: user?.name })}</h1>
        <p className="text-primary-100 text-sm mt-1">{t('dashboard.portalDesc')}</p>
      </div>

      {/* Election Time Status */}
      {electionStatus && (
        <div className={`rounded-2xl border p-4 ${
          electionStatus.status === 'active'
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{electionStatus.status === 'active' ? '🟢' : electionStatus.status === 'closed' ? '🔴' : '🟡'}</span>
            <div>
              <p className={`text-sm font-semibold ${
                electionStatus.status === 'active'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}>
                {electionStatus.status === 'active' ? t('dashboard.electionActive') :
                 electionStatus.status === 'closed' ? t('dashboard.electionEnded') :
                 electionStatus.status === 'not-started' ? t('dashboard.electionNotStarted') :
                 t('dashboard.electionNotConfigured')}
              </p>
              {electionStatus.settings && (
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  {new Date(electionStatus.settings.votingStartTime).toLocaleString()} — {new Date(electionStatus.settings.votingEndTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-3xl mb-4">🔐</div>
          <h3 className="font-bold text-surface-900 dark:text-white text-lg">{t('dashboard.fingerprintVerification')}</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">{t('dashboard.verifyIdentity')}</p>
          <Link to="/voter/verify" className="mt-4 inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors">
            {t('dashboard.verifyNow')} →
          </Link>
        </div>

        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-3xl mb-4">🗳️</div>
          <h3 className="font-bold text-surface-900 dark:text-white text-lg">{t('dashboard.castYourVote')}</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">{t('dashboard.selectAndSubmit')}</p>
          <Link to="/voter/vote" className="mt-4 inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 transition-colors">
            {t('dashboard.voteNow')} →
          </Link>
        </div>

        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 hover:shadow-lg transition-shadow">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 ${user?.hasVoted ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
            {user?.hasVoted ? '✅' : '⏳'}
          </div>
          <h3 className="font-bold text-surface-900 dark:text-white text-lg">{t('dashboard.votingStatus')}</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">
            {user?.hasVoted ? t('dashboard.alreadyVotedMsg') : t('dashboard.notVotedYet')}
          </p>
          <span className={`mt-4 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${user?.hasVoted ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
            {user?.hasVoted ? '✓ ' + t('dashboard.voted') : '● ' + t('dashboard.pending')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
