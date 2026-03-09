import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/api';
import NoticePopup from '../components/NoticePopup';

const Register = () => {
  const [formData, setFormData] = useState({
    voterId: '', name: '', email: '', fingerprintId: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      const res = await register(data);
      loginUser(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/voter/verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-surface-300 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-4">
      <NoticePopup />
      <div className="w-full max-w-2xl animate-scale-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center text-3xl text-white mb-4 shadow-xl">
            📝
          </div>
          <h1 className="text-2xl font-bold text-white">Voter Registration</h1>
          <p className="text-primary-200 text-sm mt-1">Complete your registration to participate in secure elections</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-surface-800">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">Complete Registration</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Your Voter ID and Name must match the admin-approved records</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Voter ID and Name - must match admin pre-approved records */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Voter ID</label>
                  <input type="text" name="voterId" value={formData.voterId} onChange={handleChange} placeholder="e.g. VOT1001" required className={inputClasses} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Exactly as registered by admin" required className={inputClasses} />
                </div>
              </div>
            </div>

            {/* Registration details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Fingerprint ID</label>
                <input type="text" name="fingerprintId" value={formData.fingerprintId} onChange={handleChange} placeholder="Enter unique Fingerprint ID" required className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required minLength={6} className={inputClasses} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required minLength={6} className={inputClasses} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (<><span className="btn-spinner" /> Registering...</>) : 'Complete Registration'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            Already registered?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
