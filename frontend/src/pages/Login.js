import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import NoticePopup from '../components/NoticePopup';


const Login = () => {
  const [formData, setFormData] = useState({ voterId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData);
      loginUser(res.data.token, res.data.user);
      // Redirect based on role
      navigate(res.data.user.role === 'admin' ? '/admin' : '/voter/verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-4">
      <NoticePopup />
      <div className="w-full max-w-md animate-scale-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center text-3xl text-white mb-4 shadow-xl">
            🗳️
          </div>
          <h1 className="text-2xl font-bold text-white">{t('brand')}</h1>
          <p className="text-primary-200 text-sm mt-1">{t('tagline')}</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-surface-800">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">{t('login.welcomeBack')}</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">{t('login.enterCredentials')}</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                Voter ID or Email
              </label>
              <input
                type="text"
                name="voterId"
                value={formData.voterId}
                onChange={handleChange}
                placeholder="Enter your Voter ID or Email"
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                {t('login.password')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('login.passwordPlaceholder')}
                required
                className="w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="btn-spinner" /> {t('login.loggingIn')}</>
              ) : t('login.loginBtn')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              {t('login.registerHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
