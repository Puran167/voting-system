import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNotices } from '../../services/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await getNotices();
        setNotices(res.data);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filtered = filter === 'All' ? notices : notices.filter((n) => n.priority === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('notices.title') || 'Announcements & Notices'}</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('notices.subtitle') || 'Stay updated with the latest election information'}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['All', 'Important', 'Normal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === tab
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-800 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            {tab === 'All' ? '📋 All' : tab === 'Important' ? '🔴 Important' : '🔵 Normal'}
          </button>
        ))}
      </div>

      {/* Notices */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-surface-500 dark:text-surface-400 font-medium">No notices available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((notice) => (
            <div key={notice._id} className={`bg-white dark:bg-surface-900 rounded-2xl border p-6 transition-all hover:shadow-lg ${
              notice.priority === 'Important'
                ? 'border-l-4 border-l-amber-500 border-amber-200 dark:border-amber-500/20'
                : 'border-l-4 border-l-primary-500 border-surface-200 dark:border-surface-800'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  notice.priority === 'Important'
                    ? 'bg-amber-50 dark:bg-amber-500/10'
                    : 'bg-primary-50 dark:bg-primary-500/10'
                }`}>
                  {notice.priority === 'Important' ? '⚠️' : '📢'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{notice.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      notice.priority === 'Important'
                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                    }`}>
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{notice.description}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-3 flex items-center gap-1">
                    <span>📅</span>
                    {new Date(notice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;
