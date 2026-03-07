import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVoters, getCandidates, getVotingSettings } from '../../services/api';
import StatCard from '../../components/ui/StatCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ voters: 0, candidates: 0, voted: 0, votingActive: false });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [votersRes, candidatesRes, settingsRes] = await Promise.all([
          getVoters(),
          getCandidates(),
          getVotingSettings()
        ]);
        const settings = settingsRes.data;
        const now = new Date();
        const active = settings.votingStartTime && settings.votingEndTime &&
          now >= new Date(settings.votingStartTime) && now <= new Date(settings.votingEndTime);

        setStats({
          voters: votersRes.data.length,
          candidates: candidatesRes.data.length,
          voted: votersRes.data.filter((v) => v.hasVoted).length,
          votingActive: active
        });
      } catch {
        // Stats unavailable
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('admin.dashboard')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('admin.overview')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon="👥" label={t('admin.totalVoters')} value={stats.voters} color="primary" />
          <StatCard icon="🏆" label={t('admin.candidates')} value={stats.candidates} color="purple" />
          <StatCard icon="🗳️" label={t('admin.votesCast')} value={stats.voted} color="green" />
          <StatCard icon="⏰" label={t('admin.votingStatus')} value={stats.votingActive ? t('admin.active') : t('admin.inactive')} color={stats.votingActive ? 'green' : 'orange'} />
        </div>
      )}

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{t('admin.quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: '/admin/voters', icon: '👥', title: t('admin.manageVoters'), desc: t('admin.manageVotersDesc'), c: 'primary' },
            { to: '/admin/candidates', icon: '🏆', title: t('admin.manageCandidates'), desc: t('admin.manageCandidatesDesc'), c: 'purple' },
            { to: '/admin/results', icon: '📈', title: t('admin.viewResults'), desc: t('admin.viewResultsDesc'), c: 'emerald' },
            { to: '/admin/voting-time', icon: '⏰', title: t('admin.votingSettings'), desc: t('admin.votingSettingsDesc'), c: 'amber' },
          ].map((a) => (
            <Link key={a.to} to={a.to} className={`flex items-center gap-3 p-4 rounded-xl bg-${a.c}-50 dark:bg-${a.c}-500/10 hover:bg-${a.c}-100 dark:hover:bg-${a.c}-500/20 transition-colors group`}>
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className={`text-sm font-semibold text-${a.c}-700 dark:text-${a.c}-400`}>{a.title}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {!loading && (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{t('admin.electionSummary')}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={stats.votingActive ? 'success' : 'warning'}>
              {stats.votingActive ? '● ' + t('admin.votingActive') : '● ' + t('admin.votingInactive')}
            </Badge>
            <Badge variant="info">{t('admin.registeredVoters', { count: stats.voters })}</Badge>
            <Badge variant="primary">{t('admin.candidatesCount', { count: stats.candidates })}</Badge>
            <Badge variant={stats.voted > 0 ? 'success' : 'default'}>
              {t('admin.votesCastCount', { count: stats.voted })}
              {stats.voters > 0 && ` (${((stats.voted / stats.voters) * 100).toFixed(0)}%)`}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
