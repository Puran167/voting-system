import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotices } from '../services/api';

const NoticePopup = () => {
  const [notice, setNotice] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = sessionStorage.getItem('noticePopupDismissed');
    if (dismissed) return;

    const fetchLatestImportant = async () => {
      try {
        const res = await getNotices();
        const important = res.data.find((n) => n.priority === 'Important');
        if (important) {
          setNotice(important);
          setVisible(true);
        }
      } catch {
        // fail silently
      }
    };
    fetchLatestImportant();
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem('noticePopupDismissed', 'true');
  };

  const handleViewAll = () => {
    setVisible(false);
    sessionStorage.setItem('noticePopupDismissed', 'true');
    navigate('/voter/notices');
  };

  if (!visible || !notice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="max-w-md w-full bg-white dark:bg-surface-900 rounded-2xl border border-amber-200 dark:border-amber-500/20 shadow-2xl overflow-hidden animate-scale-in">
        {/* Header stripe */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📢</span>
            <div>
              <p className="text-[10px] font-bold text-amber-100 uppercase tracking-wider">Important Notice</p>
              <h3 className="text-lg font-bold text-white">{notice.title}</h3>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{notice.description}</p>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-3">
            📅 {new Date(notice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleViewAll}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-all"
          >
            View All Notices
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
