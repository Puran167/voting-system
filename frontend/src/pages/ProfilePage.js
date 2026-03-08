import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProfile } from '../services/api';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayProfile = profile || user;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header card */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-purple-500 rounded-t-2xl sm:rounded-t-3xl px-6 sm:px-8 pt-8 sm:pt-10 pb-20 sm:pb-24 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('profile.title')}</h1>
          <p className="text-sm sm:text-base text-white/70 mt-1">{t('profile.subtitle')}</p>
        </div>
      </div>

      {/* Profile body */}
      <div className="relative bg-white dark:bg-surface-900 rounded-b-2xl sm:rounded-b-3xl shadow-xl border border-t-0 border-surface-200 dark:border-surface-800 px-6 sm:px-8 pb-8">
        {/* Avatar overlap */}
        <div className="flex justify-center -mt-14 sm:-mt-16 mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold ring-4 ring-white dark:ring-surface-900 shadow-xl">
            {displayProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>

        {/* Name & role */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            {displayProfile?.name}
          </h2>
          <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs sm:text-sm font-semibold capitalize ${
            displayProfile?.role === 'admin'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
              : 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'
          }`}>
            {displayProfile?.role}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            label={t('profile.fullName')}
            value={displayProfile?.name}
          />
          <InfoCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            label={t('profile.email')}
            value={displayProfile?.email}
          />
          <InfoCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            }
            label={t('profile.voterId')}
            value={displayProfile?.voterId}
          />
          <InfoCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            }
            label={t('profile.fingerprintId')}
            value={displayProfile?.fingerprintId}
          />
          <InfoCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            label={t('profile.role')}
            value={<span className="capitalize">{displayProfile?.role}</span>}
          />
          <InfoCard
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label={t('profile.createdAt')}
            value={displayProfile?.createdAt ? new Date(displayProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('profile.goBack')}
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50">
    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] sm:text-xs text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm sm:text-base font-semibold text-surface-900 dark:text-white break-all mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

export default ProfilePage;
