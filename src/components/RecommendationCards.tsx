import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Percent, Calculator, Target, Info, X } from 'lucide-react';
import type { LoanRecommendation } from '../types';

interface Props {
  recommendations: LoanRecommendation[];
  onApply: (loan: LoanRecommendation) => void;
}

type FlowStep = 'cards' | 'confirm' | 'processing' | 'success';

const PROCESSING_STEPS = [
  'Verifying your profile...',
  'Checking eligibility with bank...',
  'Submitting your application...',
  'Getting response from bank...',
];

export const RecommendationCards: React.FC<Props> = ({ recommendations, onApply }) => {
  const [selectedLoan, setSelectedLoan] = useState<LoanRecommendation | null>(null);
  const [flowStep, setFlowStep] = useState<FlowStep>('cards');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [refNumber] = useState(() => Math.floor(10000000 + Math.random() * 90000000));

  if (!recommendations || recommendations.length === 0) return null;

  const handleApplyClick = (loan: LoanRecommendation) => {
    setSelectedLoan(loan);
    setFlowStep('confirm');
  };

  const handleConfirm = () => {
    setFlowStep('processing');
    setCompletedSteps([]);
    setProgress(0);

    PROCESSING_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
        setProgress(Math.round(((i + 1) / PROCESSING_STEPS.length) * 100));
        if (i === PROCESSING_STEPS.length - 1) {
          setTimeout(() => {
            setFlowStep('success');
            if (selectedLoan) onApply(selectedLoan);
          }, 800);
        }
      }, (i + 1) * 1500);
    });
  };

  const handleCancel = () => {
    setFlowStep('cards');
    setSelectedLoan(null);
    setCompletedSteps([]);
    setProgress(0);
  };

  const handleAnotherBank = () => {
    setFlowStep('cards');
    setSelectedLoan(null);
    setCompletedSteps([]);
    setProgress(0);
  };

  return (
    <div className="space-y-6 animate-slide-up-fade">

      {/* Confirmation Modal */}
      <AnimatePresence>
        {flowStep === 'confirm' && selectedLoan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider">
                    {selectedLoan.providerName}
                  </p>
                  <h3 className="text-white text-2xl font-bold mt-1">
                    {selectedLoan.productName}
                  </h3>
                </div>
                <button onClick={handleCancel} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-blue-200 text-sm">Estimated EMI</span>
                  <span className="text-white font-bold">{selectedLoan.emiEstimate}</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-blue-200 text-sm">Interest Rate</span>
                  <span className="text-white font-bold">{selectedLoan.interestRate}</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3">
                  <span className="text-blue-200 text-sm">Eligibility</span>
                  <span className="text-white font-bold">{selectedLoan.eligibilityStatus}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg"
                >
                  Confirm & Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Processing Screen */}
      <AnimatePresence>
        {flowStep === 'processing' && selectedLoan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl p-10 w-full max-w-md shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-300 font-bold text-xl">
                  {selectedLoan.providerName?.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <p className="text-blue-300 text-sm font-semibold mb-6">
                Applying to {selectedLoan.providerName}
              </p>

              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{progress}%</span>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 text-left">
                {PROCESSING_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: completedSteps.includes(i) ? 1 : 0.3, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${completedSteps.includes(i)
                      ? 'bg-green-500'
                      : 'bg-white/20'
                      }`}>
                      {completedSteps.includes(i) && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className={`text-sm transition-colors duration-500 ${completedSteps.includes(i) ? 'text-white' : 'text-white/30'
                      }`}>
                      {step.replace('bank', selectedLoan.providerName)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Screen */}
      <AnimatePresence>
        {flowStep === 'success' && selectedLoan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.4 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-2xl p-10 w-full max-w-md shadow-2xl text-center"
            >
              {/* Big green checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>

              <h2 className="text-white text-2xl font-bold mb-2">
                Application Submitted!
              </h2>
              <p className="text-blue-200 text-sm mb-6 leading-relaxed">
                Your application to <span className="text-white font-semibold">{selectedLoan.providerName}</span> has been received.
                A representative will contact you within <span className="text-white font-semibold">24–48 hours</span>.
              </p>

              <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 mb-8 inline-block w-full">
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider mb-1">
                  Reference Number
                </p>
                <p className="text-white text-xl font-bold tracking-widest">
                  REF#{refNumber}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAnotherBank}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold hover:from-blue-600 hover:to-blue-800 transition-all shadow-lg"
                >
                  Apply to Another Bank
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Start New Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="flex items-center space-x-2 pb-2 border-b border-white/20">
        <Target className="w-6 h-6 text-blue-300" />
        <h2 className="text-2xl font-semibold text-white">Your Top Matches</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id || index.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-1 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-green-400/90 to-emerald-600/90 backdrop-blur-md text-white px-4 py-2 rounded-bl-2xl font-bold flex items-center shadow-sm">
              {rec.matchScore}% Match
            </div>

            <div className="mb-4 pt-4">
              <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">{rec.providerName}</h3>
              <h4 className="text-xl font-bold text-white mt-1">{rec.productName}</h4>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-white bg-white/10 p-3 rounded-xl border border-white/10">
                <Calculator className="w-5 h-5 mr-3 text-blue-300" />
                <div>
                  <p className="text-xs text-blue-100 font-medium">Estimated EMI</p>
                  <p className="font-semibold">{rec.emiEstimate}</p>
                </div>
              </div>
              <div className="flex items-center text-white bg-white/10 p-3 rounded-xl border border-white/10">
                <Percent className="w-5 h-5 mr-3 text-blue-300" />
                <div>
                  <p className="text-xs text-blue-100 font-medium">Interest Rate</p>
                  <p className="font-semibold">{rec.interestRate}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2 text-sm font-semibold text-blue-50">
                <Info className="w-4 h-4 text-blue-200" />
                <span>Key Features</span>
              </div>
              <ul className="space-y-2">
                {rec.keyFeatures?.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto border-t border-white/20 pt-4 flex items-center justify-between">
              <span className="text-sm text-blue-100 font-medium">Eligibility Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${rec.eligibilityStatus.toLowerCase() === 'high'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : rec.eligibilityStatus.toLowerCase() === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                {rec.eligibilityStatus}
              </span>
            </div>

            <button
              onClick={() => handleApplyClick(rec)}
              className="w-full mt-4 bg-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-md shadow-sm"
            >
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
