import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sendOtp, verifyOtp } from '../../services/api';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Send OTP on page load
  useEffect(() => {
    handleSendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async () => {
    setSending(true);
    setError('');
    setMessage('');
    try {
      const res = await sendOtp();
      setMaskedEmail(res.data.email);
      setMessage(res.data.message);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setSending(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError(t('otp.enterComplete'));
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await verifyOtp({ otp: otpString });
      setMessage(res.data.message);
      setTimeout(() => navigate('/voter/verify'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-3xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{t('otp.title')}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{t('otp.subtitle')}</p>
      </div>

      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        {maskedEmail && (
          <div className="mb-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-700 dark:text-primary-400 text-sm text-center">
            {t('otp.sentTo')} <strong>{maskedEmail}</strong>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium text-center">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium text-center">{error}</div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Input Boxes */}
          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3 text-center">
              {t('otp.enterOtp')}
            </label>
            <div className="flex justify-center gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (<><span className="btn-spinner" /> {t('otp.verifying')}</>) : t('otp.verifyBtn')}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">{t('otp.didntReceive')}</p>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sending || countdown > 0}
              className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            >
              {sending ? t('otp.sending') : countdown > 0 ? `${t('otp.resendIn')} ${countdown}s` : t('otp.resendOtp')}
            </button>
          </div>

          {/* Timer info */}
          <p className="text-xs text-surface-400 dark:text-surface-500 text-center">
            {t('otp.expiresIn')}
          </p>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
