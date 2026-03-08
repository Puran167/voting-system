import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getNotices, createNotice, deleteNotice } from '../../services/api';

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Normal' });
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const fetchNotices = async () => {
    try {
      const res = await getNotices();
      setNotices(res.data);
    } catch {
      setError('Failed to load notices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createNotice(form);
      setForm({ title: '', description: '', priority: 'Normal' });
      setShowForm(false);
      await fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create notice.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch {
      setError('Failed to delete notice.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('notices.manage') || 'Manage Notices'}</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('notices.manageDesc') || 'Create and manage election announcements'}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Notice'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">New Notice</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Election Date Announcement"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Voting will start on 15 April at 9:00 AM."
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-all"
            >
              {submitting ? 'Publishing...' : 'Publish Notice'}
            </button>
          </form>
        </div>
      )}

      {/* Notices List */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-12 text-center">
          <div className="text-5xl mb-4">📢</div>
          <p className="text-surface-500 dark:text-surface-400 font-medium">No notices yet. Click "Add Notice" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className={`bg-white dark:bg-surface-900 rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
              notice.priority === 'Important'
                ? 'border-amber-200 dark:border-amber-500/20'
                : 'border-surface-200 dark:border-surface-800'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{notice.priority === 'Important' ? '🔴' : '🔵'}</span>
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{notice.title}</h3>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      notice.priority === 'Important'
                        ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        : 'bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400'
                    }`}>
                      {notice.priority}
                    </span>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{notice.description}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-2">
                    {new Date(notice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(notice._id)}
                  className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-sm font-semibold transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageNotices;
