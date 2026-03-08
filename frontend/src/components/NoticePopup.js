import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotices } from '../services/api';

const NoticePopup = () => {
  const [notice, setNotice] = useState(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
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
          setTimeout(() => setVisible(true), 300);
        }
      } catch {
        // fail silently
      }
    };
    fetchLatestImportant();
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('noticePopupDismissed', 'true');
    }, 250);
  };

  const handleViewAll = () => {
    dismiss();
    setTimeout(() => navigate('/voter/notices'), 300);
  };

  if (!visible || !notice) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={dismiss}>
      {/* Backdrop */}
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`} />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        {/* Gradient header with animated icon */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 px-8 py-8 text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-4 left-8 w-2 h-2 bg-white/30 rounded-full" />
          <div className="absolute bottom-6 right-12 w-3 h-3 bg-white/20 rounded-full" />

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>

          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
              🔔
            </div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-[0.2em] mb-2">📌 Important Announcement</p>
            <h3 className="text-2xl font-black text-white leading-tight">{notice.title}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white dark:bg-surface-900 px-8 py-6">
          <p className="text-base text-surface-700 dark:text-surface-300 leading-relaxed">{notice.description}</p>

          <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 w-fit">
            <span className="text-sm">📅</span>
            <span className="text-xs font-semibold text-surface-500 dark:text-surface-400">
              {new Date(notice.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-surface-900 px-8 pb-8 flex gap-3">
          <button
            onClick={dismiss}
            className="flex-1 px-5 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-bold hover:bg-surface-200 dark:hover:bg-surface-700 transition-all border border-surface-200 dark:border-surface-700"
          >
            ✕ Close
          </button>
          <button
            onClick={handleViewAll}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white text-sm font-bold shadow-xl shadow-primary-600/25 hover:shadow-primary-600/40 hover:-translate-y-0.5 transition-all"
          >
            📋 View All Notices
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
