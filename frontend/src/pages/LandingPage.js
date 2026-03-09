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
    <div className="min-h-screen flex flex-col bg-surface-50 text-surface-900 overflow-hidden">

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-extrabold text-white">
              V
            </div>
            <span className="hidden sm:inline text-sm font-semibold tracking-tight text-surface-800">
              {t('brandShort')}
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {!user && (
              <Link
                to="/login"
                className="px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm text-surface-500 hover:text-surface-900 border border-transparent hover:border-surface-300 transition-colors"
              >
                {t('landing.login')}
              </Link>
            )}
            <Link
              to={ctaLink}
              className="px-4 sm:px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              {user ? t('landing.goToDashboard') : t('landing.getStarted')}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 right-[-6rem] w-72 h-72 bg-emerald-400/15 blur-3xl" />
            <div className="absolute bottom-[-6rem] left-[-4rem] w-80 h-80 bg-cyan-400/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.5) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left: text */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 border border-surface-200 text-[10px] font-semibold uppercase tracking-[0.18em] text-surface-500 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t('landing.badge')}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight text-surface-900">
                  {t('landing.heroTitle1')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-300">
                    {t('landing.heroTitle2')}
                  </span>
                  <br className="hidden sm:block" />
                  {t('landing.heroTitle3')}
                </h1>

                <p className="text-sm sm:text-base text-surface-500 max-w-xl mx-auto lg:mx-0">
                  Secure biometric voting with fingerprint, live photo and receipt-based verification.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    to={ctaLink}
                    className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5"
                  >
                    {user ? t('landing.goToDashboard') : t('landing.getStarted')}
                    <span className="ml-2">→</span>
                  </Link>
                  {!user && (
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full border border-surface-300 text-sm text-surface-600 hover:text-surface-900 hover:border-surface-500 bg-white/60 transition-colors"
                    >
                      {t('landing.login')}
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                  {[ 'Biometric auth', 'Real-time results', 'Vote receipt' ].map((label) => (
                    <span
                      key={label}
                      className="px-3 py-1 rounded-full bg-white/80 border border-surface-200 text-[11px] text-surface-500"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: illustration */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-sm space-y-4">
                  {/* Main glass card */}
                  <div className="rounded-3xl bg-white shadow-xl border border-surface-200 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-surface-500 mb-1">Live election</p>
                        <p className="text-sm font-semibold text-surface-900">Smart Voting 2026</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-600 border border-emerald-100">
                        ● Secure
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: 'Identity verified', value: '100%', color: 'bg-emerald-500' },
                        { label: 'Votes cast', value: '76%', color: 'bg-cyan-500' },
                        { label: 'Turnout', value: '65%', color: 'bg-amber-400' },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-surface-500">
                            <span>{item.label}</span>
                            <span className="text-surface-800 font-semibold">{item.value}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-surface-100 overflow-hidden">
                            <div className={`${item.color} h-full rounded-full w-4/5`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps card */}
                  <div className="rounded-3xl bg-white border border-surface-200 p-4 grid grid-cols-3 gap-2 text-center text-[11px]">
                    {[
                      { icon: '👤', label: 'Register' },
                      { icon: '📸', label: 'Verify' },
                      { icon: '🗳️', label: 'Vote' },
                    ].map((step) => (
                      <div key={step.label} className="flex flex-col items-center gap-1">
                        <span className="w-7 h-7 rounded-xl bg-surface-100 flex items-center justify-center">
                          {step.icon}
                        </span>
                        <span className="text-surface-600">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compact features strip */}
        <section className="border-t border-surface-200 bg-white/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-surface-500">
              {t('landing.featuresTitle')}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'Fingerprint + photo verification',
                'Activity logs for every vote',
                'Downloadable vote receipt',
                'Multi-language interface',
              ].map((text) => (
                <span
                  key={text}
                  className="px-3 py-1 rounded-full bg-white border border-surface-200 text-[11px] text-surface-500"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer + notices */}
      <NoticePopup />
      <footer className="border-t border-surface-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-surface-500">
            © 2026 {t('brand')}. {t('landing.copyright')}
          </span>
          <span className="text-xs text-surface-400">
            Built for secure campus & organizational elections.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
