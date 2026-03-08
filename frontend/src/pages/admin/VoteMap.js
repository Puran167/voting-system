import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getLocationStats } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VoteMap = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getLocationStats();
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load location stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-surface-500 dark:text-surface-400">{t('voteMap.loading')}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm text-center">
      {error}
    </div>
  );

  const locations = stats ? Object.keys(stats) : [];
  const counts = stats ? Object.values(stats) : [];
  const totalVotes = counts.reduce((a, b) => a + b, 0);

  const chartData = {
    labels: locations.map(l => l || t('voteMap.unknown')),
    datasets: [
      {
        label: t('voteMap.votes'),
        data: counts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.06)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('voteMap.title')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('voteMap.subtitle')}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 text-center">
          <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{t('voteMap.totalVotes')}</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{totalVotes}</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 text-center">
          <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{t('voteMap.uniqueLocations')}</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{locations.length}</p>
        </div>
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-4 text-center">
          <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{t('voteMap.topLocation')}</p>
          <p className="text-lg font-bold text-surface-900 dark:text-white truncate">
            {locations.length > 0 ? (locations[counts.indexOf(Math.max(...counts))] || t('voteMap.unknown')) : '—'}
          </p>
        </div>
      </div>

      {/* Chart */}
      {locations.length > 0 ? (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{t('voteMap.chartTitle')}</h2>
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-8 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <p className="text-surface-500 dark:text-surface-400">{t('voteMap.noData')}</p>
        </div>
      )}

      {/* Table */}
      {locations.length > 0 && (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-900 dark:text-white">{t('voteMap.breakdown')}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 dark:bg-surface-800">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase">{t('voteMap.location')}</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase">{t('voteMap.voteCount')}</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase">{t('voteMap.percentage')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {locations.map((loc, i) => (
                  <tr key={loc} className="hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="px-6 py-3 text-surface-900 dark:text-white font-medium">{loc || t('voteMap.unknown')}</td>
                    <td className="px-6 py-3 text-right text-surface-700 dark:text-surface-300">{counts[i]}</td>
                    <td className="px-6 py-3 text-right text-surface-500 dark:text-surface-400">
                      {totalVotes > 0 ? ((counts[i] / totalVotes) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteMap;
