import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getVoteLogs, deleteVoteLog, clearAllVoteLogs } from '../../services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchLogs = async () => {
    try {
      const res = await getVoteLogs();
      setLogs(res.data);
    } catch {
      // Error loading logs
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;
    try {
      await deleteVoteLog(id);
      toast.success('Log entry deleted.');
      fetchLogs();
    } catch {
      toast.error('Failed to delete log entry.');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL activity logs? This cannot be undone.')) return;
    try {
      await clearAllVoteLogs();
      toast.success('All logs cleared.');
      setLogs([]);
    } catch {
      toast.error('Failed to clear logs.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-surface-500 dark:text-surface-400">{t('admin.loadingLogs')}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('admin.activityLogs')}</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('admin.votingHistory', { count: logs.length })}</p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 transition-colors"
          >
            🗑️ Clear All Logs
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800">
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">#</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.voter')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.voterId')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.candidate')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.party')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.photo')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.timestamp')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-surface-400 dark:text-surface-500">
                    <div className="text-4xl mb-2">📋</div>
                    No voting activity recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4 text-surface-400 dark:text-surface-500 font-mono text-xs">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{log.voterId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400 font-mono text-xs">{log.voterId?.voterId || 'N/A'}</td>
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{log.candidateId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400">{log.candidateId?.party || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {log.photo ? (
                        <img src={`http://localhost:5000${log.photo}`} alt="Voter" className="w-10 h-10 rounded-lg object-cover border border-surface-200 dark:border-surface-700" />
                      ) : (
                        <span className="text-xs text-surface-400">{t('admin.noPhoto')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-surface-500 dark:text-surface-400 text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(log._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
