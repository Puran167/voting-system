import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyVoteById } from '../services/api';

const VerifyVote = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [verificationId, setVerificationId] = useState(initialId);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleVerify = async (e) => {
    e.preventDefault();
    const trimmed = verificationId.trim();
    if (!trimmed) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await verifyVoteById(trimmed);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t('verify.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-950 dark:to-surface-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-3xl mb-3">
            🔍
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('verify.title')}</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{t('verify.subtitle')}</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              {t('verify.inputLabel')}
            </label>
            <input
              type="text"
              value={verificationId}
              onChange={(e) => setVerificationId(e.target.value)}
              placeholder="VOTE-XXXXX"
              className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-lg tracking-widest font-mono"
              maxLength={12}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !verificationId.trim()}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? t('verify.verifying') : t('verify.verifyBtn')}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{t('verify.valid')}</p>
            <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
              {t('verify.idLabel')}: <span className="font-mono font-bold">{result.verificationId}</span>
            </p>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {t('verify.timestamp')}: {new Date(result.timestamp).toLocaleString()}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">{result.message}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-center">
            <div className="text-3xl mb-2">❌</div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            ← {t('verify.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyVote;
