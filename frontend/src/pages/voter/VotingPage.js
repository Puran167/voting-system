import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getCandidates, castVote, getVotingStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CandidateCard from '../../components/CandidateCard';

const VotingPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votingStatus, setVotingStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isVotingActive = votingStatus?.status === 'active';
  const isVotingClosed = votingStatus?.status === 'closed';
  const isVotingNotStarted = votingStatus?.status === 'not-started';
  const isElectionNotConfigured = votingStatus?.status === 'no-settings';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, statusRes] = await Promise.all([
          getCandidates(),
          getVotingStatus()
        ]);
        setCandidates(candidatesRes.data);
        setVotingStatus(statusRes.data);
      } catch (err) {
        setError('Failed to load voting data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // When voter selects a candidate, show confirmation
  const handleSelectCandidate = (candidate) => {
    if (user?.hasVoted) {
      setError('You have already voted.');
      return;
    }
    if (!isVotingActive) {
      setError('Voting is currently closed.');
      return;
    }
    setSelectedCandidate(candidate);
    setShowConfirm(true);
  };

  // Confirm and cast vote (no photo needed at this step)
  const handleConfirmVote = async () => {
    setShowConfirm(false);
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const res = await castVote({ candidateId: selectedCandidate._id });
      setMessage('Your vote has been cast successfully!');
      setUser({ ...user, hasVoted: true });
      // Navigate to success/receipt page with receipt data
      setTimeout(() => navigate('/voter/success', { state: { receipt: res.data.receipt } }), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote.');
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-surface-500 dark:text-surface-400">{t('voting.loading')}</p>
      </div>
    </div>
  );

  const StatusCard = ({ icon, title, message: msg, extra, variant }) => {
    const colors = {
      warning: 'from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200 dark:border-amber-500/20',
      error: 'from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10 border-red-200 dark:border-red-500/20',
      success: 'from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border-emerald-200 dark:border-emerald-500/20',
    };
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className={`max-w-md w-full bg-gradient-to-br ${colors[variant]} rounded-2xl border p-8 text-center`}>
          <div className="text-5xl mb-4">{icon}</div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-surface-600 dark:text-surface-400">{msg}</p>
          {extra && <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">{extra}</p>}
        </div>
      </div>
    );
  };

  if (votingStatus && votingStatus.status === 'not-started') {
    return <StatusCard icon="⏰" title={t('voting.notStartedTitle')} message={votingStatus.message} variant="warning"
      extra={votingStatus.settings ? t('voting.votingStartsAt', { time: new Date(votingStatus.settings.votingStartTime).toLocaleString() }) : undefined} />;
  }

  if (votingStatus && votingStatus.status === 'closed') {
    return <StatusCard icon="🚫" title={t('voting.closedTitle')} message={votingStatus.message} variant="error" />;
  }

  if (user?.hasVoted) {
    return <StatusCard icon="✅" title={t('voting.alreadyVotedTitle')} message={t('voting.alreadyVotedMsg')} variant="success" />;
  }

  // Determine if vote buttons should be disabled
  const votingDisabled = !isVotingActive;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('voting.castYourVote')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('voting.selectCandidate')}</p>
      </div>

      {/* Election Time Lock Banner */}
      {votingDisabled && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-center">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {isVotingClosed ? '🚫 ' + t('voting.votingEnded') : isVotingNotStarted ? '⏰ ' + t('voting.votingNotStarted') : '⚠️ ' + t('voting.votingClosed')}
          </p>
          {votingStatus?.settings && (
            <div className="mt-2 text-xs text-amber-600 dark:text-amber-500">
              <span>{t('voting.election')}: {new Date(votingStatus.settings.votingStartTime).toLocaleString()} — {new Date(votingStatus.settings.votingEndTime).toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">{message}</div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-4xl mb-3">🗳️</div>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{t('voting.confirmTitle')}</h3>
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">{t('voting.votingFor')}</p>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400">{selectedCandidate.name}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">{selectedCandidate.party}</p>
              <p className="text-xs text-red-500 dark:text-red-400 mb-4">{t('voting.cannotUndo')}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleConfirmVote}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-colors"
                >
                  {submitting ? t('voting.submitting') : t('voting.confirmBtn')}
                </button>
                <button
                  onClick={() => { setShowConfirm(false); setSelectedCandidate(null); }}
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors"
                >
                  {t('voting.cancelBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate._id} candidate={candidate} onSelect={handleSelectCandidate} selectable disabled={votingDisabled} />
        ))}
      </div>
    </div>
  );
};

export default VotingPage;
