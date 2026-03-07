import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getVotingSettings, setVotingTime } from '../../services/api';

const VotingTimeSettings = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [currentSettings, setCurrentSettings] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getVotingSettings();
        if (res.data && res.data.votingStartTime) {
          setCurrentSettings(res.data);
          // Pre-fill the form with existing values
          setStartTime(new Date(res.data.votingStartTime).toISOString().slice(0, 16));
          setEndTime(new Date(res.data.votingEndTime).toISOString().slice(0, 16));
        }
      } catch {
        // No settings yet
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await setVotingTime({
        votingStartTime: new Date(startTime).toISOString(),
        votingEndTime: new Date(endTime).toISOString()
      });
      toast.success('Voting time settings saved!');
      setCurrentSettings(res.data.settings);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update voting time.');
    } finally {
      setLoading(false);
    }
  };

  // Determine current status
  const getStatus = () => {
    if (!currentSettings) return { text: t('admin.notConfigured'), className: 'not-voted' };
    const now = new Date();
    const start = new Date(currentSettings.votingStartTime);
    const end = new Date(currentSettings.votingEndTime);
    if (now < start) return { text: t('admin.notStarted'), className: 'not-voted' };
    if (now > end) return { text: t('admin.closed'), className: 'not-voted' };
    return { text: t('admin.active'), className: 'voted' };
  };

  const status = getStatus();
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('admin.votingTimeSettings')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('admin.configureElectionTime')}</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
      )}

      {/* Current Settings */}
      {currentSettings && (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{t('admin.currentConfig')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">{t('admin.startTime')}</p>
              <p className="text-sm font-bold text-surface-900 dark:text-white">{new Date(currentSettings.votingStartTime).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">{t('admin.endTime')}</p>
              <p className="text-sm font-bold text-surface-900 dark:text-white">{new Date(currentSettings.votingEndTime).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">{t('admin.status')}</p>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${status.text === 'Active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                ● {status.text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Update Form */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{t('admin.updateSettings')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.votingStartTime')}</label>
              <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={inputClasses} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.votingEndTime')}</label>
              <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className={inputClasses} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-colors flex items-center gap-2">
            {loading ? (<><span className="btn-spinner" /> {t('admin.saving')}</>) : t('admin.saveSettings')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VotingTimeSettings;
