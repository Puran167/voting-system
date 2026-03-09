import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { getCandidates, addCandidate, deleteCandidate } from '../../services/api';

const API_BASE = process.env.REACT_APP_API_URL?.replace('/api', '') || (window.location.hostname !== 'localhost' ? 'https://voting-system-backend-b9y7.onrender.com' : 'http://localhost:5000');

const ManageCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchCandidates = async () => {
    try {
      const res = await getCandidates();
      setCandidates(res.data);
    } catch {
      setError('Failed to load candidates.');
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('party', party);
      if (photo) formData.append('photo', photo);

      await addCandidate(formData);
      toast.success('Candidate added successfully!');
      setName('');
      setParty('');
      setPhoto(null);
      setShowForm(false);
      fetchCandidates();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteCandidate'))) return;
    try {
      await deleteCandidate(id);
      toast.success('Candidate deleted.');
      fetchCandidates();
    } catch {
      setError('Failed to delete candidate.');
    }
  };

  const inputClasses = "w-full px-4 py-2.5 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('admin.manageCandidates')}</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{candidates.length} {t('admin.candidatesRegistered')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${showForm ? 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300' : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30'}`}
        >
          {showForm ? t('admin.cancel') : t('admin.addCandidate')}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
      )}

      {/* Add Candidate Form */}
      {showForm && (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 animate-slide-in">
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">{t('admin.addNewCandidate')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.candidateName')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.party')}</label>
                <input type="text" value={party} onChange={(e) => setParty(e.target.value)} required className={inputClasses} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">{t('admin.photo')}</label>
              <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="block w-full text-sm text-surface-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-500/10 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100 dark:hover:file:bg-primary-500/20" />
            </div>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 transition-colors flex items-center gap-2">
              {loading ? (<><span className="btn-spinner" /> {t('admin.adding')}</>) : t('admin.addCandidate')}
            </button>
          </form>
        </div>
      )}

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-12 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-surface-500 dark:text-surface-400">{t('admin.noCandidatesYet')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((c) => (
            <div key={c._id} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-white dark:bg-surface-800 flex items-center justify-center p-3 border-b border-surface-200 dark:border-surface-800">
                {c.photo ? (
                  <img src={`${API_BASE}${c.photo}`} alt={c.name} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-500/20 dark:to-purple-500/20 flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-surface-900 dark:text-white text-lg leading-snug">{c.name}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{c.party}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400">
                    {c.votes} {t('admin.votes')}
                  </span>
                  <button onClick={() => handleDelete(c._id)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCandidates;
