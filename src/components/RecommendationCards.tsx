import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Percent, Calculator, Target, Info } from 'lucide-react';
import type { LoanRecommendation } from '../types';

interface Props {
  recommendations: LoanRecommendation[];
  onApply: (loan: LoanRecommendation) => void;
}

export const RecommendationCards: React.FC<Props> = ({ recommendations, onApply }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-6 animate-slide-up-fade">
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
            {/* Match Score Badge */}
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
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                rec.eligibilityStatus.toLowerCase() === 'high' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                rec.eligibilityStatus.toLowerCase() === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {rec.eligibilityStatus}
              </span>
            </div>
            
            <button className="w-full mt-4 bg-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30 backdrop-blur-md shadow-sm">
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
