import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-surface-900 dark:text-white leading-tight truncate max-w-[120px]">
            {user?.name}
          </p>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 capitalize">
            {user?.role}
          </p>
        </div>
        <svg className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-700 overflow-hidden z-50 animate-fade-in">
          {/* User header */}
          <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-500/10 dark:to-purple-500/10 border-b border-surface-200 dark:border-surface-700">
            <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
          </div>

          <div className="py-1.5">
            {/* Profile */}
            <button
              onClick={() => { setOpen(false); navigate('/profile'); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            >
              <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {t('profile.viewProfile')}
            </button>

            {/* Voting History (voter only) */}
            {user?.role === 'voter' && (
              <button
                onClick={() => { setOpen(false); navigate('/voter'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t('profile.votingHistory')}
              </button>
            )}

            {/* Divider */}
            <div className="my-1.5 border-t border-surface-200 dark:border-surface-700" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
