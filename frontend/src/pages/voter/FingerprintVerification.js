import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { verifyFingerprint } from '../../services/api';
import StepProgress from '../../components/StepProgress';

const FingerprintVerification = () => {
  const [fingerprintId, setFingerprintId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();



  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await verifyFingerprint({ fingerprintId });
      setMessage(res.data.message);
      // After successful verification, navigate to photo capture page
      setTimeout(() => navigate('/voter/capture-photo'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <StepProgress currentStep="fingerprint" completedSteps={{}} />
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-3xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('fingerprint.title')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('fingerprint.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              {t('fingerprint.fingerprintId')}
            </label>
            <input
              type="text"
              value={fingerprintId}
              onChange={(e) => setFingerprintId(e.target.value)}
              placeholder={t('fingerprint.placeholder')}
              required
              className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (<><span className="btn-spinner" /> {t('fingerprint.verifying')}</>) : t('fingerprint.verifyBtn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FingerprintVerification;
