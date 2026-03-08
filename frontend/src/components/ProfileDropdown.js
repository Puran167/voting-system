import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProfile } from '../services/api';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      setProfile(res.data);
    } catch {
      // profile data already available from context as fallback
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfile = () => {
    setOpen(false);
    setShowProfile(true);
    if (!profile) fetchProfile();
  };

  const handleLogout = () => {
    setOpen(false);
    setShowProfile(false);
    logout();
    navigate('/login');
  };

  const displayProfile = profile || user;

  return (
    <>
      {/* Avatar trigger */}
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
                onClick={handleOpenProfile}
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

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowProfile(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md max-h-[95vh] bg-white dark:bg-surface-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto animate-fade-in">
            {/* Header */}
            <div className="sticky top-0 z-10 relative bg-gradient-to-br from-primary-600 via-primary-500 to-purple-500 px-5 sm:px-6 pt-6 sm:pt-8 pb-14 sm:pb-16">
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-lg sm:text-xl font-bold text-white">{t('profile.title')}</h2>
              <p className="text-xs sm:text-sm text-white/70 mt-0.5">{t('profile.subtitle')}</p>
            </div>

            {/* Avatar overlap */}
            <div className="flex justify-center -mt-9 sm:-mt-10">
              <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold ring-4 ring-white dark:ring-surface-900 shadow-lg">
                {displayProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>

            {/* Content */}
            <div className="px-5 sm:px-6 pt-3 sm:pt-4 pb-5 sm:pb-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-center mb-4 sm:mb-5">
                    <h3 className="text-base sm:text-lg font-bold text-surface-900 dark:text-white">
                      {displayProfile?.name}
                    </h3>
                    <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      displayProfile?.role === 'admin'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
                    }`}>
                      {displayProfile?.role}
                    </span>
                  </div>

                  <div className="space-y-2.5 sm:space-y-3">
                    <ProfileField
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                      label={t('profile.email')}
                      value={displayProfile?.email}
                    />
                    <ProfileField
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                        </svg>
                      }
                      label={t('profile.voterId')}
                      value={displayProfile?.voterId}
                    />
                    <ProfileField
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                      }
                      label={t('profile.fingerprintId')}
                      value={displayProfile?.fingerprintId}
                    />
                    <ProfileField
                      icon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                      label={t('profile.createdAt')}
                      value={displayProfile?.createdAt ? new Date(displayProfile.createdAt).toLocaleDateString() : '—'}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-5 sm:mt-6">
                    <button
                      onClick={() => setShowProfile(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                      {t('profile.close')}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-md"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ProfileField = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-surface-900 dark:text-white break-all">{value || '—'}</p>
    </div>
  </div>
);

export default ProfileDropdown;
