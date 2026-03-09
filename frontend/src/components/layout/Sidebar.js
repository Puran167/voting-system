import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

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
            onClick={() => { onClose(); navigate('/profile'); }}
            className="w-full flex items-center gap-3 p-1 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            {user?.profilePhoto ? (
              <img
                src={`${API_BASE}${user.profilePhoto}`}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
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
      </aside>
    </>
  );
};

export default Sidebar;
