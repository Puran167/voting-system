import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getVoters, addVoter, deleteVoter } from '../../services/api';

const ManageVoters = () => {
  const [voters, setVoters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', voterId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchVoters = async () => {
    try {
      const res = await getVoters();
      setVoters(res.data);
    } catch {
      setError('Failed to load voters.');
    }
  };

  useEffect(() => { fetchVoters(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await addVoter(formData);
      toast.success('Voter pre-registered successfully!');
      setFormData({ name: '', voterId: '' });
      setShowForm(false);
      fetchVoters();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add voter.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteVoter'))) return;
    try {
      await deleteVoter(id);
      toast.success('Voter deleted.');
      fetchVoters();
    } catch {
      setError('Failed to delete voter.');
    }
  };

  const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('admin.manageVoters')}</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{voters.length} {t('admin.registeredVotersLabel')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${showForm ? 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'}`}
        >
          {showForm ? t('admin.cancel') : 'Pre-Register Voter'}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
      )}

      {/* Add Voter Form (Pre-Registration: only voterId + name) */}
      {showForm && (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 animate-slide-in">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Pre-Register Eligible Voter</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Add voter ID and name. The voter will complete registration themselves.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.voterId')}</label>
                <input type="text" name="voterId" value={formData.voterId} onChange={handleChange} placeholder="e.g. VOT1001" required className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.name')}</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full name of voter" required className={inputClasses} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-colors flex items-center gap-2">
              {loading ? (<><span className="btn-spinner" /> Adding...</>) : 'Pre-Register Voter'}
            </button>
          </form>
        </div>
      )}

      {/* Voters Table */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800">
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">Photo</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.voterId')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.name')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.email')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">Registration</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.status')}</th>
                <th className="text-left px-6 py-4 font-semibold text-surface-500 dark:text-surface-400 uppercase text-xs tracking-wider">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {voters.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-surface-400 dark:text-surface-500">
                    <div className="text-4xl mb-2">👥</div>
                    No voters added yet. Pre-register voters to get started.
                  </td>
                </tr>
              ) : (
                voters.map((voter) => (
                  <tr key={voter._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4">
                      {voter.profilePhoto ? (
                        <img src={`${API_BASE}${voter.profilePhoto}`} alt={voter.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {voter.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400 font-mono text-xs">{voter.voterId}</td>
                    <td className="px-6 py-4 font-medium text-surface-900 dark:text-white">{voter.name}</td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400">{voter.email || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${voter.registered ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'}`}>
                        {voter.registered ? 'Registered' : 'Not Registered'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${voter.hasVoted ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                        {voter.hasVoted ? t('admin.voted') : t('admin.pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(voter._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        {t('admin.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageVoters;
