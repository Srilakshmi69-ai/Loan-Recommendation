import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2, ArrowRight, RotateCcw, Building2 } from 'lucide-react';
import type { LoanRecommendation } from '../types';

type FlowScreen = 'confirm' | 'progress' | 'success';

interface Props {
  loan: LoanRecommendation;
  onClose: () => void;
  onRestart: () => void;
}

const STEPS = (bankName: string) => [
  'Verifying your profile...',
  `Checking eligibility with ${bankName}...`,
  'Submitting your application...',
  `Getting response from ${bankName}...`,
];

export const ApplicationFlow: React.FC<Props> = ({ loan, onClose, onRestart }) => {
  const [screen, setScreen] = useState<FlowScreen>('confirm');
  const [progressPercent, setProgressPercent] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [refNumber] = useState(() => {
    return `REF#${Math.floor(10000000 + Math.random() * 90000000)}`;
  });

  const steps = STEPS(loan.providerName);

  // --- Progress animation ---
  useEffect(() => {
    if (screen !== 'progress') return;

    // Animate progress bar
    const totalDuration = steps.length * 1500;
    const interval = 30;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgressPercent(pct);
      if (elapsed >= totalDuration) clearInterval(timer);
    }, interval);

    // Animate steps one by one
    steps.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i);
      }, i * 1500);
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
      }, (i + 1) * 1500 - 200);
    });

    // Move to success screen
    setTimeout(() => {
      setScreen('success');
    }, totalDuration + 600);

    return () => clearInterval(timer);
  }, [screen, steps.length]);

  const handleConfirm = () => {
    setScreen('progress');
  };

  // --- Screen 1: Confirmation Modal ---
  const renderConfirm = () => (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Bank logo initial */}
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mr-4">
          {loan.providerName.charAt(0)}
        </div>
        <div>
          <h3 className="text-white text-xl font-bold">{loan.providerName}</h3>
          <p className="text-blue-200 text-sm">{loan.productName}</p>
        </div>
      </div>

      {/* Loan details */}
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          <span className="text-blue-200 text-sm">Interest Rate</span>
          <span className="text-white font-semibold">{loan.interestRate}</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          <span className="text-blue-200 text-sm">Estimated EMI</span>
          <span className="text-white font-semibold">{loan.emiEstimate}</span>
        </div>
        <div className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          <span className="text-blue-200 text-sm">Match Score</span>
          <span className="text-green-400 font-semibold">{loan.matchScore}%</span>
        </div>
      </div>

      <p className="text-gray-400 text-xs text-center mb-6">
        By applying, you agree to share your profile details with {loan.providerName} for loan processing.
      </p>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-400 hover:to-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          Confirm & Apply
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  // --- Screen 2: Progress ---
  const renderProgress = () => (
    <motion.div
      key="progress"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
    >
      {/* Bank header */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-3">
          {loan.providerName.charAt(0)}
        </div>
        <h3 className="text-white text-lg font-bold">{loan.providerName}</h3>
        <p className="text-blue-200 text-sm">{loan.productName}</p>
      </div>

      {/* Circular progress */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - progressPercent / 100)}`}
              className="transition-all duration-100 ease-linear"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((stepText, i) => {
          const isCompleted = completedSteps.includes(i);
          const isActive = activeStep === i && !isCompleted;
          const isVisible = i <= activeStep;

          if (!isVisible) return null;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : isActive
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-white/5 border-white/10'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" />
              )}
              <span className={`text-sm font-medium ${
                isCompleted ? 'text-green-300' : 'text-blue-200'
              }`}>
                {stepText}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  // --- Screen 3: Success ---
  const renderSuccess = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl mb-6"
      >
        <motion.div
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-white mb-3"
      >
        Application Submitted Successfully!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-300 text-sm mb-5 leading-relaxed"
      >
        Your application to <span className="text-white font-semibold">{loan.providerName}</span> has been received.
        A representative will contact you within <span className="text-blue-300 font-semibold">24–48 hours</span> on your registered details.
      </motion.p>

      {/* Reference number */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 mb-8"
      >
        <Building2 className="w-4 h-4 text-blue-300" />
        <span className="text-blue-100 text-sm font-medium">Reference:</span>
        <span className="text-white font-bold text-lg tracking-wider">{refNumber}</span>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/10 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          Apply to Another Bank
        </button>
        <button
          onClick={onRestart}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-400 hover:to-indigo-500 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start New Application
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={screen === 'confirm' ? onClose : undefined} />

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === 'confirm' && renderConfirm()}
          {screen === 'progress' && renderProgress()}
          {screen === 'success' && renderSuccess()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
