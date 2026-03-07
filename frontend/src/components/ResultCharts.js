import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
];

const ResultCharts = ({ candidates }) => {
  const labels = candidates.map((c) => c.name);
  const votes = candidates.map((c) => c.votes);

  const barData = {
    labels,
    datasets: [{
      label: 'Total Votes',
      data: votes,
      backgroundColor: COLORS.slice(0, candidates.length),
      borderRadius: 6
    }]
  };

  const pieData = {
    labels,
    datasets: [{
      data: votes,
      backgroundColor: COLORS.slice(0, candidates.length),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Votes by Candidate', font: { size: 16 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Vote Distribution', font: { size: 16 } }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default ResultCharts;
