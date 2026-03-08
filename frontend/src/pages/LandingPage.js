import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import NoticePopup from '../components/NoticePopup';

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const dashboardPath = user ? (user.role === 'admin' ? '/admin' : '/voter') : null;
  const ctaLink = dashboardPath || '/register';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-950 overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-surface-950/70 border-b border-surface-100/80 dark:border-surface-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 via-primary-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">V</div>
            <span className="text-xl font-black text-surface-900 dark:text-white tracking-tight">{t('brand')}</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to={dashboardPath} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white text-sm font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5">
                {t('landing.goToDashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2.5 rounded-xl text-surface-600 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-bold transition-colors">
                  {t('landing.login')}
                </Link>
                <Link to="/register" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white text-sm font-bold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5">
                  {t('landing.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative flex-1 flex items-center justify-center">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/20 to-purple-400/20 dark:from-primary-600/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/15 to-primary-400/15 dark:from-emerald-600/8 dark:to-primary-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-300/10 to-purple-300/10 dark:from-primary-700/5 dark:to-purple-700/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-6 py-20 lg:py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200/60 dark:border-primary-800/40 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-primary-700 dark:text-primary-300 tracking-wide uppercase">{t('landing.badge')}</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-surface-900 dark:text-white tracking-tight mb-6">
            {t('landing.heroTitle1')}{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-500 to-primary-600">{t('landing.heroTitle2')}</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary-600/20 to-purple-500/20 blur-sm rounded-full" />
            </span>
            <br className="hidden sm:block" />
            {t('landing.heroTitle3')}
          </h1>

          <p className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed mb-10">
            {t('landing.heroDesc')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-4 justify-center mb-14">
            <Link
              to={ctaLink}
              className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-primary-600/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/30"
            >
              {t('landing.getStarted')}
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-surface-800/80 backdrop-blur border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 font-bold text-base hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:-translate-y-1 shadow-lg shadow-surface-900/5"
            >
              {t('landing.login')}
            </Link>
          </div>

          {/* Stats row */}
          <div className="inline-flex items-center gap-8 sm:gap-12 px-8 py-5 rounded-2xl bg-white/60 dark:bg-surface-800/40 backdrop-blur-lg border border-surface-200/60 dark:border-surface-700/40 shadow-xl shadow-surface-900/5">
            {[
              { icon: '🛡️', value: '100%', label: t('landing.statSecure') },
              { icon: '🔑', value: '2FA', label: t('landing.statAuth') },
              { icon: '🌐', value: '3+', label: t('landing.statLanguages') },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-10 bg-surface-200 dark:bg-surface-700" />}
                <div className="text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p className="text-2xl font-black text-surface-900 dark:text-white">{s.value}</p>
                  <p className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative bg-surface-50/80 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight">
              {t('landing.howItWorks')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { step: '01', icon: '👤', label: t('landing.step1'), color: 'from-primary-500 to-primary-600' },
              { step: '02', icon: '📧', label: t('landing.step2'), color: 'from-purple-500 to-purple-600' },
              { step: '03', icon: '🔐', label: t('landing.step3'), color: 'from-emerald-500 to-emerald-600' },
              { step: '04', icon: '🗳️', label: t('landing.step4'), color: 'from-amber-500 to-amber-600' },
              { step: '05', icon: '📄', label: t('landing.step5'), color: 'from-rose-500 to-rose-600' },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="relative bg-white dark:bg-surface-800 rounded-2xl p-6 text-center border border-surface-100 dark:border-surface-700/50 shadow-lg shadow-surface-900/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} text-2xl mb-4 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-[10px] font-black text-surface-300 dark:text-surface-600 tracking-widest uppercase mb-2">Step {item.step}</div>
                  <p className="text-sm font-bold text-surface-800 dark:text-surface-200">{item.label}</p>
                </div>
                {i < 4 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 text-surface-300 dark:text-surface-600 z-10">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-surface-900 dark:text-white tracking-tight mb-3">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-base text-surface-400 dark:text-surface-500 max-w-lg mx-auto">{t('landing.featuresDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔐', title: t('landing.feature1Title'), desc: t('landing.feature1Desc'), gradient: 'from-primary-500/10 to-primary-600/5', border: 'hover:border-primary-300 dark:hover:border-primary-700' },
              { icon: '📧', title: t('landing.feature2Title'), desc: t('landing.feature2Desc'), gradient: 'from-purple-500/10 to-purple-600/5', border: 'hover:border-purple-300 dark:hover:border-purple-700' },
              { icon: '📊', title: t('landing.feature4Title'), desc: t('landing.feature4Desc'), gradient: 'from-emerald-500/10 to-emerald-600/5', border: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
            ].map((f, i) => (
              <div key={i} className={`group relative bg-white dark:bg-surface-800/80 rounded-2xl p-8 border border-surface-100 dark:border-surface-700/50 ${f.border} shadow-lg shadow-surface-900/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} dark:from-surface-700/50 dark:to-surface-800/50 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 p-12 sm:p-16 text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-white/20 rounded-full" />
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/20 rounded-full" />

            <div className="relative">
              <div className="text-6xl mb-6">🗳️</div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                {t('landing.everyVoteTitle')}
              </h2>
              <p className="text-base sm:text-lg text-primary-100 max-w-xl mx-auto mb-8 leading-relaxed">
                {t('landing.everyVoteDesc')}
              </p>
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-700 font-bold text-base shadow-xl shadow-black/10 hover:-translate-y-1 hover:shadow-2xl transition-all"
              >
                {t('landing.getStarted')}
                <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <NoticePopup />
      <footer className="border-t border-surface-100 dark:border-surface-800/60 bg-surface-50/50 dark:bg-surface-900/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-md">V</div>
            <span className="text-sm font-bold text-surface-600 dark:text-surface-400">{t('brand')}</span>
          </div>
          <p className="text-xs text-surface-400 dark:text-surface-500">© 2026 {t('brand')}. {t('landing.copyright')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
