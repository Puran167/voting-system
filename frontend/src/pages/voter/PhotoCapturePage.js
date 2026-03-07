import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { capturePhoto } from '../../services/api';
import CameraCapture from '../../components/CameraCapture';

const PhotoCapturePage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePhotoCapture = async (photoData) => {
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      await capturePhoto({ photo: photoData });
      setMessage('Photo captured successfully! Redirecting to voting page...');
      // Navigate to voting page after successful photo capture
      setTimeout(() => navigate('/voter/vote'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to capture photo.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-3xl mb-4">📸</div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('photo.title')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('photo.subtitle')}</p>
      </div>

      {/* Fingerprint verified banner */}
      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-center">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          ✅ {t('photo.verified')}
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">{message}</div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">{error}</div>
      )}

      {!submitting && !message && (
        <CameraCapture onCapture={handlePhotoCapture} onCancel={() => {}} />
      )}

      {submitting && !message && (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-surface-500 dark:text-surface-400">{t('photo.uploading')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoCapturePage;
