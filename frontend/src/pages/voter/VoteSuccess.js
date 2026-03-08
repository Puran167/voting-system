import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import generateReceipt from '../../utils/generateReceipt';
import StepProgress from '../../components/StepProgress';

const VoteSuccess = () => {
  const location = useLocation();
  const receipt = location.state?.receipt;
  // Ensure the receipt can only be downloaded once per page load
  const hasDownloaded = useRef(false);
  const { t } = useTranslation();

  const handleDownload = async () => {
    if (!receipt) return;
    if (hasDownloaded.current) return;
    hasDownloaded.current = true;
    await generateReceipt(receipt);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-full max-w-2xl mb-6">
        <StepProgress currentStep="receipt" completedSteps={{ otp: true, fingerprint: true, photo: true, vote: true, receipt: true }} />
      </div>
      <div className="max-w-md w-full bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-8 text-center animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-4xl mb-4">
          ✅
        </div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">{t('success.title')}</h2>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">{t('success.thankYou')}</p>

        {/* Show verification ID if receipt data is available */}
        {receipt && (
          <div className="mb-6 p-4 rounded-xl bg-white/60 dark:bg-surface-800/60 border border-emerald-200 dark:border-emerald-500/20">
            <p className="text-xs text-surface-500 dark:text-surface-400 font-medium mb-1">{t('success.verificationId')}</p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 tracking-wider">{receipt.verificationId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Download Receipt button — only shown when receipt data exists */}
          {receipt && (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg shadow-emerald-500/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('success.downloadReceipt')}
            </button>
          )}
          <Link to="/voter" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30 transition-colors">
            {t('success.backToDashboard')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VoteSuccess;
