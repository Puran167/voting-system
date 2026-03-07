import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getResults } from '../../services/api';
import ResultCharts from '../../components/ResultCharts';
import socket from '../../services/socket';

const ResultsDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getResults();
        setCandidates(res.data);
      } catch {
        // Error loading results
      } finally {
        setLoading(false);
      }
    };
    fetchResults();

    // Listen for real-time vote updates
    socket.on('voteUpdate', (updatedCandidates) => {
      setCandidates(updatedCandidates);
    });

    return () => socket.off('voteUpdate');
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-surface-500 dark:text-surface-400">{t('admin.loadingResults')}</p>
      </div>
    </div>
  );

  const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
  const winner = candidates.length > 0 ? candidates[0] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('admin.electionResults')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('admin.realTimeStats')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{t('admin.totalVotesCast')}</p>
          <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">{totalVotes}</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{t('admin.totalCandidates')}</p>
          <p className="mt-2 text-3xl font-bold text-surface-900 dark:text-white">{candidates.length}</p>
        </div>
        {winner && winner.votes > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-2xl border border-amber-200 dark:border-amber-500/20 p-5">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{t('admin.leadingCandidate')}</p>
            <p className="mt-1 text-xl font-bold text-surface-900 dark:text-white">{winner.name}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">{winner.party} — {winner.votes} votes</p>
          </div>
        )}
      </div>

      {/* Charts */}
      {candidates.length > 0 ? (
        <ResultCharts candidates={candidates} />
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-12 text-center">
          <div className="text-5xl mb-3">📊</div>
          <p className="text-surface-500 dark:text-surface-400">{t('admin.noVotingData')}</p>
        </div>
      )}

      {/* Detailed Results Table */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white">{t('admin.detailedResults')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800">
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.rank')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.candidate')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.party')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.votesCast')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.percentage')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {candidates.map((c, index) => (
                <tr key={c._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${index === 0 && c.votes > 0 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{c.name}</td>
                  <td className="px-6 py-4 text-surface-600 dark:text-surface-400">{c.party}</td>
                  <td className="px-6 py-4 font-bold text-surface-900 dark:text-white">{c.votes}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden max-w-24">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${totalVotes > 0 ? (c.votes / totalVotes * 100) : 0}%` }} />
                      </div>
                      <span className="text-sm font-semibold text-surface-600 dark:text-surface-400">
                        {totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
