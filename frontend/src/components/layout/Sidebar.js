import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProfile } from '../../services/api';

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleOpenProfile = async () => {
    setShowProfile(true);
    if (!profile) {
      setProfileLoading(true);
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch {
        setProfile(user);
      } finally {
        setProfileLoading(false);
      }
    }
  };

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/login');
  };

  const displayProfile = profile || user;

  const adminLinks = [
    { to: '/admin', icon: '📊', label: t('nav.dashboard'), end: true },
    { to: '/admin/voters', icon: '👥', label: t('nav.manageVoters') },
    { to: '/admin/candidates', icon: '🏆', label: t('nav.candidates') },
    { to: '/admin/voting-time', icon: '⏰', label: t('nav.votingTime') },
    { to: '/admin/results', icon: '📈', label: t('nav.results') },
    { to: '/admin/logs', icon: '📋', label: t('nav.activityLogs') },
    { to: '/admin/vote-map', icon: '🗺️', label: t('nav.voteMap') },
    { to: '/admin/notices', icon: '📢', label: t('nav.notices') || 'Notices' },
  ];

  const voterLinks = [
    { to: '/voter', icon: '🏠', label: t('nav.dashboard'), end: true },
    { to: '/voter/verify', icon: '🔐', label: t('nav.verifyIdentity') },
    { to: '/voter/capture-photo', icon: '📸', label: t('nav.capturePhoto') || 'Capture Photo' },
    { to: '/voter/vote', icon: '🗳️', label: t('nav.castVote') },
    { to: '/verify-vote', icon: '🔍', label: t('nav.verifyVote') },
    { to: '/voter/notices', icon: '📢', label: t('nav.notices') || 'Notices' },
  ];

  const links = user?.role === 'admin' ? adminLinks : voterLinks;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 
          bg-white dark:bg-surface-900 
          border-r border-surface-200 dark:border-surface-800
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-surface-200 dark:border-surface-800 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-lg font-bold">
            V
          </div>
          <div>
            <h1 className="text-sm font-bold text-surface-900 dark:text-white leading-tight">
              {t('brandShort')}
            </h1>
            <p className="text-[10px] text-surface-500 dark:text-surface-400 uppercase tracking-wider font-semibold">
              {user?.role === 'admin' ? t('nav.adminPanel') : t('nav.voterPortal')}
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
            {t('nav.navigation')}
          </p>
          {links.map((link) => {
            const isActive = link.end
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-800 shrink-0">
          <button
            onClick={handleOpenProfile}
            className="w-full flex items-center gap-3 p-1 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                {user?.role}
              </p>
            </div>
            <svg className="w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowProfile(false)} />
            <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
              <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-purple-500 px-6 pt-8 pb-16">
                <button onClick={() => setShowProfile(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-xl font-bold text-white">{t('profile.title')}</h2>
                <p className="text-sm text-white/70 mt-0.5">{t('profile.subtitle')}</p>
              </div>
              <div className="flex justify-center -mt-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white dark:ring-surface-900 shadow-lg">
                  {displayProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="px-6 pt-4 pb-6">
                {profileLoading ? (
                  <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>
                ) : (
                  <>
                    <div className="text-center mb-5">
                      <h3 className="text-lg font-bold text-surface-900 dark:text-white">{displayProfile?.name}</h3>
                      <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${displayProfile?.role === 'admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400'}`}>
                        {displayProfile?.role}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <SidebarProfileField label={t('profile.email')} value={displayProfile?.email} />
                      <SidebarProfileField label={t('profile.voterId')} value={displayProfile?.voterId} />
                      <SidebarProfileField label={t('profile.fingerprintId')} value={displayProfile?.fingerprintId} />
                      <SidebarProfileField label={t('profile.createdAt')} value={displayProfile?.createdAt ? new Date(displayProfile.createdAt).toLocaleDateString() : '—'} />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowProfile(false)} className="flex-1 px-4 py-2.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm font-semibold hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                        {t('profile.close')}
                      </button>
                      <button onClick={handleLogout} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-md">
                        {t('nav.logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

const SidebarProfileField = ({ label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
    <div className="min-w-0">
      <p className="text-[11px] text-surface-500 dark:text-surface-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{value || '—'}</p>
    </div>
  </div>
);

export default Sidebar;
