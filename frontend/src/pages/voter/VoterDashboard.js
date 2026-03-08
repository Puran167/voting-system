import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getVotingStatus, getVoterStatus } from '../../services/api';
import StepProgress from '../../components/StepProgress';

const VoterDashboard = () => {
  const { user } = useAuth();
  const [electionStatus, setElectionStatus] = useState(null);
  const [voterStatus, setVoterStatus] = useState(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, voterRes] = await Promise.all([
          getVotingStatus(),
          getVoterStatus()
        ]);
        setElectionStatus(statusRes.data);
        setVoterStatus(voterRes.data);
      } catch {
        // Silently fail
      }
    };
    fetchData();
  }, []);

  // Determine current step and completed steps
  const getFlowState = () => {
    if (!voterStatus) return { currentStep: 'otp', completedSteps: {} };
    const completed = {};
    if (voterStatus.otpVerified) completed.otp = true;
    if (voterStatus.fingerprintVerified) completed.fingerprint = true;
    if (voterStatus.photoCaptured) completed.photo = true;
    if (voterStatus.hasVoted) {
      completed.vote = true;
      completed.receipt = true;
    }

    let currentStep = 'otp';
    if (voterStatus.otpVerified) currentStep = 'fingerprint';
    if (voterStatus.fingerprintVerified) currentStep = 'photo';
    if (voterStatus.photoCaptured) currentStep = 'vote';
    if (voterStatus.hasVoted) currentStep = 'receipt';

    return { currentStep, completedSteps: completed };
  };

  const { currentStep, completedSteps } = getFlowState();

  const handleContinueFlow = () => {
    switch (currentStep) {
      case 'otp': navigate('/voter/verify-otp'); break;
      case 'fingerprint': navigate('/voter/verify'); break;
      case 'photo': navigate('/voter/capture-photo'); break;
      case 'vote': navigate('/voter/vote'); break;
      case 'receipt': navigate('/voter/success'); break;
      default: navigate('/voter/verify-otp');
    }
  };

  const stepDetails = [
    { key: 'otp', icon: '📧', title: t('dashboard.otpVerification') || 'OTP Verification', desc: t('dashboard.otpDesc') || 'Verify your email with a one-time password', path: '/voter/verify-otp', done: completedSteps.otp },
    { key: 'fingerprint', icon: '🔐', title: t('dashboard.fingerprintVerification'), desc: t('dashboard.verifyIdentity'), path: '/voter/verify', done: completedSteps.fingerprint },
    { key: 'photo', icon: '📸', title: t('dashboard.photoCapture') || 'Photo Capture', desc: t('dashboard.photoDesc') || 'Capture your photo as proof of identity', path: '/voter/capture-photo', done: completedSteps.photo },
    { key: 'vote', icon: '🗳️', title: t('dashboard.castYourVote'), desc: t('dashboard.selectAndSubmit'), path: '/voter/vote', done: completedSteps.vote },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">{t('dashboard.welcome', { name: user?.name })}</h1>
        <p className="text-primary-100 text-sm mt-1">{t('dashboard.portalDesc')}</p>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Voting Progress</h2>
        <StepProgress currentStep={currentStep} completedSteps={completedSteps} />
        {!voterStatus?.hasVoted && (
          <div className="mt-4 text-center">
            <button
              onClick={handleContinueFlow}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/30 transition-all duration-200"
            >
              {currentStep === 'otp' ? 'Start Verification →' :
               currentStep === 'receipt' ? 'View Receipt →' :
               'Continue to Next Step →'}
            </button>
          </div>
        )}
      </div>

      {/* Election Time Status */}
      {electionStatus && (
        <div className={`rounded-2xl border p-4 ${
          electionStatus.status === 'active'
            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{electionStatus.status === 'active' ? '🟢' : electionStatus.status === 'closed' ? '🔴' : '🟡'}</span>
            <div>
              <p className={`text-sm font-semibold ${
                electionStatus.status === 'active'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-400'
              }`}>
                {electionStatus.status === 'active' ? t('dashboard.electionActive') :
                 electionStatus.status === 'closed' ? t('dashboard.electionEnded') :
                 electionStatus.status === 'not-started' ? t('dashboard.electionNotStarted') :
                 t('dashboard.electionNotConfigured')}
              </p>
              {electionStatus.settings && (
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                  {new Date(electionStatus.settings.votingStartTime).toLocaleString()} — {new Date(electionStatus.settings.votingEndTime).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stepDetails.map((step, idx) => {
          const isCurrentStep = step.key === currentStep;
          const isPrevDone = idx === 0 || stepDetails[idx - 1].done;
          const isAccessible = step.done || (isCurrentStep && isPrevDone);

          return (
            <div key={step.key} className={`bg-white dark:bg-surface-900 rounded-2xl border p-6 transition-shadow ${
              step.done ? 'border-emerald-200 dark:border-emerald-500/20' :
              isCurrentStep ? 'border-primary-300 dark:border-primary-500/30 shadow-lg' :
              'border-surface-200 dark:border-surface-800 opacity-60'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  step.done ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                  isCurrentStep ? 'bg-primary-50 dark:bg-primary-500/10' :
                  'bg-surface-100 dark:bg-surface-800'
                }`}>
                  {step.done ? '✅' : step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-surface-900 dark:text-white">{step.title}</h3>
                    {step.done && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">DONE</span>
                    )}
                    {isCurrentStep && !step.done && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 animate-pulse">CURRENT</span>
                    )}
                  </div>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{step.desc}</p>
                  {isAccessible && !step.done && (
                    <Link to={step.path} className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-lg shadow-primary-500/30 transition-colors">
                      Go →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voting Status Card */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${user?.hasVoted ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-amber-50 dark:bg-amber-500/10'}`}>
            {user?.hasVoted ? '✅' : '⏳'}
          </div>
          <div>
            <h3 className="font-bold text-surface-900 dark:text-white text-lg">{t('dashboard.votingStatus')}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {user?.hasVoted ? t('dashboard.alreadyVotedMsg') : t('dashboard.notVotedYet')}
            </p>
          </div>
          <span className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-bold ${user?.hasVoted ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
            {user?.hasVoted ? '✓ ' + t('dashboard.voted') : '● ' + t('dashboard.pending')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
