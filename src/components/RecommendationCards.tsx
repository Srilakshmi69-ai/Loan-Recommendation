import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, TrendingUp, HelpCircle, Landmark } from 'lucide-react';
import type { LoanRecommendation, UserProfile } from '../types';

interface Props {
  recommendations: LoanRecommendation[];
  onApply: (loan: LoanRecommendation) => void;
  userProfile?: UserProfile | null;
}
const getBankURL = (providerName: string, loanType: string, productName: string = ''): string => {
  const provider = (providerName || '').toLowerCase();
  const type = (loanType || '').toLowerCase();
  const product = (productName || '').toLowerCase();

  // EDUCATION LOANS
  if (type.includes('edu') || type.includes('stud') || type.includes('college') || type.includes('school')) {
    if (provider.includes('sbi')) {
      return 'https://onlineapply.sbi.bank.in/personal-banking/scholar-loan';
    }
    if (provider.includes('hdfc')) {
      if (product.includes('credila') || provider.includes('credila')) {
        return 'https://www.credila.com';
      }
      return 'https://www.hdfc.bank.in/education-loan';
    }
    if (provider.includes('icici')) {
      return 'https://www.icicibank.com/personal-banking/loans/education-loan';
    }
    if (provider.includes('axis')) {
      return 'https://www.axisbank.com/retail/loans/education-loan';
    }
    if (provider.includes('baroda') || provider.includes('bob')) {
      return 'https://www.bankofbaroda.in/personal-banking/loans/education-loans';
    }
  }

  // PERSONAL LOANS
  if (type.includes('pers') || type.includes('med') || type.includes('trav') || type.includes('wed') || type.includes('vac') || type.includes('marri') || type.includes('health') || type.includes('emerg') || type.includes('other')) {
    if (provider.includes('sbi')) {
      return 'https://onlineapply.sbi.bank.in/personal-banking/personal-loan';
    }
    if (provider.includes('hdfc')) {
      return 'https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan';
    }
    if (provider.includes('icici')) {
      return 'https://www.icicibank.com/personal-banking/loans/personal-loan';
    }
    if (provider.includes('axis')) {
      return 'https://www.axisbank.com/retail/loans/personal-loan-for-salaried';
    }
    if (provider.includes('kotak')) {
      return 'https://www.kotak.com/en/personal-banking/loans/personal-loan.html';
    }
  }

  // HOME LOANS
  if (type.includes('hom') || type.includes('hous') || type.includes('flat') || type.includes('prop')) {
    if (provider.includes('sbi')) {
      return 'https://onlineapply.sbi.bank.in/personal-banking/home-loan';
    }
    if (provider.includes('hdfc')) {
      return 'https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan';
    }
    if (provider.includes('icici')) {
      return 'https://www.icicibank.com/personal-banking/loans/home-loan';
    }
    if (provider.includes('axis')) {
      return 'https://www.axisbank.com/retail/loans/home-loan';
    }
    if (provider.includes('lic')) {
      return 'https://www.lichousing.com/apply-now';
    }
  }

  // CAR LOANS
  if (type.includes('car') || type.includes('veh') || type.includes('auto') || type.includes('bike')) {
    if (provider.includes('sbi')) {
      return 'https://onlineapply.sbi.bank.in/personal-banking/car-loan';
    }
    if (provider.includes('hdfc')) {
      return 'https://www.hdfcbank.com/personal/borrow/popular-loans/new-car-loan';
    }
    if (provider.includes('icici')) {
      return 'https://www.icicibank.com/personal-banking/loans/car-loan';
    }
    if (provider.includes('axis')) {
      return 'https://www.axisbank.com/retail/loans/car-loan';
    }
  }

  // BUSINESS LOANS
  if (type.includes('bus') || type.includes('owner') || type.includes('enter') || type.includes('company') || type.includes('shop')) {
    if (provider.includes('sbi')) {
      return 'https://onlineapply.sbi.bank.in/personal-banking/business-loan';
    }
    if (provider.includes('hdfc')) {
      return 'https://www.hdfcbank.com/sme/borrow/working-capital-loans/business-loan';
    }
    if (provider.includes('icici')) {
      return 'https://www.icicibank.com/business-banking/loans/business-loan';
    }
    if (provider.includes('axis')) {
      return 'https://www.axisbank.com/business-banking/loans-and-advances/unsecured-business-loan';
    }
  }

  return 'https://www.paisabazaar.com';
};

export const RecommendationCards: React.FC<Props> = ({ recommendations, userProfile }) => {
  if (!recommendations || recommendations.length === 0) return null;

  // Extract profile parameters with default fallback values
  const userCibil = parseInt(userProfile?.creditScore?.replace(/[^0-9]/g, '') || '700', 10);
  const userIncome = parseInt(userProfile?.monthlyIncome?.replace(/[^0-9]/g, '') || '75000', 10);
  const userAmount = parseInt(userProfile?.amount?.replace(/[^0-9]/g, '') || '500000', 10);
  const loanPurpose = userProfile?.loanPurpose || 'Personal';

  // Extract details from the highest matching option (first element)
  const bestOption = recommendations[0] as any;
  const bestEmiVal = parseInt(bestOption.emiEstimate?.replace(/[^0-9]/g, '') || '10000', 10);
  const totalMonths = (bestOption.tenureYears || 5) * 12;
  const totalInterest = Math.max(0, (bestEmiVal * totalMonths) - Math.min(userAmount, bestOption.minCibil * 1000 || 500000));

  // 1. Dynamic AI Match explanation points
  const getAiPoints = (): string[] => {
    const points: string[] = [];

    // Point 1: 40% income rule
    const maxEmiAllowed = userIncome * 0.4;
    if (bestEmiVal <= maxEmiAllowed) {
      points.push(`Your monthly income of ₹${userIncome.toLocaleString('en-IN')} comfortably supports a maximum budget EMI of ₹${Math.round(maxEmiAllowed).toLocaleString('en-IN')} (40% rule).`);
    } else {
      points.push(`Your estimated EMI of ₹${bestEmiVal.toLocaleString('en-IN')} exceeds 40% of your net monthly income (₹${Math.round(maxEmiAllowed).toLocaleString('en-IN')}). Consider a slightly longer tenure.`);
    }

    // Point 2: CIBIL Qualification
    if (userCibil >= 750) {
      points.push(`Your excellent CIBIL score of ${userCibil} qualifies you for prime interest rates and instant processing.`);
    } else if (userCibil >= 680) {
      points.push(`Your good CIBIL score of ${userCibil} qualifies you for all top-tier commercial lenders.`);
    } else {
      points.push(`Your CIBIL score is ${userCibil}. Public sector banks like SBI or BOB offer the most competitive approvals.`);
    }

    // Point 3: Loan type specific information
    const purposeLower = loanPurpose.toLowerCase();
    if (purposeLower.includes('edu') || purposeLower.includes('stud')) {
      points.push("Under Central Sector Interest Subsidy (CSIS), you may claim subsidies on interest accrued during the study period.");
    } else if (purposeLower.includes('hom') || purposeLower.includes('hous')) {
      points.push("Home loans are eligible for standard income tax exemptions up to ₹2,00,000 under Section 24.");
    } else if (purposeLower.includes('bus')) {
      points.push("Interest payments on business loans are fully deductible as business expenses under Income Tax Act.");
    } else {
      points.push("Personal loans are entirely unsecured with no collateral or pledge requirements.");
    }

    // Point 4: Interest payable
    points.push(`Estimated total interest payable over the full tenure is approximately ₹${totalInterest.toLocaleString('en-IN')}.`);

    // Point 5: Tenure
    points.push(`Recommended tenure of ${bestOption.tenureYears || 5} years keeps your EMI affordable at ₹${bestEmiVal.toLocaleString('en-IN')} per month.`);

    return points;
  };

  // 2. Personalized Tips based on profile
  const getEligibilityTips = (): string[] => {
    const tips: string[] = [];
    if (userCibil < 750) {
      tips.push("Pay all existing credit card bills and loan EMIs on time for 6 consecutive months to boost your CIBIL score.");
    } else {
      tips.push("Your credit score is exceptional! Maintain a low credit utilization ratio (below 30%) to retain this status.");
    }

    const existingEmi = parseInt(userProfile?.existingEmi?.replace(/[^0-9]/g, '') || '0', 10);
    if (existingEmi > 0) {
      tips.push("Consider prepaying or consolidating your high-cost short-term debts to reduce your current monthly debt obligation.");
    } else {
      tips.push("Avoid submitting multiple loan queries in a short timeframe, as hard inquiries can negatively affect your score.");
    }

    tips.push("Ensure your Aadhaar and PAN records have perfectly matching names and spellings to prevent documentation delays.");

    return tips;
  };

  // Helper to get bank background initials colors
  const getBankBadgeStyle = (color: string) => {
    switch (color) {
      case 'green': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'blue': return 'bg-[#f0f4ff] text-[#4f6ef7] border border-[#dbeafe]';
      case 'orange': return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'purple': return 'bg-purple-50 text-purple-600 border border-purple-200';
      case 'red': return 'bg-red-50 text-red-600 border border-red-200';
      case 'teal': return 'bg-teal-50 text-teal-600 border border-teal-200';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  // 3. side-by-side comparison helpers to identify the best cells
  // Convert interest rate to numeric float
  const rates = recommendations.map((r: any) => parseFloat(r.interestRate));
  const minRate = Math.min(...rates);

  // Convert Max amount to numeric integer
  const amounts = recommendations.map((r: any) => {
    const text = r.maxAmountText || '';
    if (text.includes('Cr')) return parseFloat(text.replace(/[^0-9.]/g, '')) * 100;
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  });
  const maxAmountVal = Math.max(...amounts);

  // Convert Processing Fee to numeric percentage
  const fees = recommendations.map((r: any) => parseFloat(r.processingFeeText || '0'));
  const minFee = Math.min(...fees);

  const bestCibil = Math.min(...recommendations.map((r: any) => r.minCibil || 700));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">

      {/* AI PROFILE SUITABILITY DASHBOARD */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#e2e8f0] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-tr from-[#4f6ef7] to-[#7c3aed] text-white rounded-xl">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1a1f36] tracking-tight">Why these loans match your profile</h3>
            <p className="text-xs text-[#718096]">Custom AI Analysis • {loanPurpose} Recommendation Matrix</p>
          </div>
        </div>

        <ul className="space-y-4">
          {getAiPoints().map((pt, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-[#4a5568] leading-relaxed">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f0f4ff] text-[#4f6ef7] flex items-center justify-center font-bold text-xs mt-0.5">
                {idx + 1}
              </span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RECOMMENDATIONS CARDS GRID */}
      <div>
        <h3 className="text-lg font-bold text-[#1a1f36] mb-6 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-[#4f6ef7]" />
          <span>Curated Loan Offers</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.map((loan: any) => {
            // Apply Redirect URL Formatter
            const applyUrl = getBankURL(loan.providerName, loanPurpose, loan.productName);



            return (
              <div key={loan.id} className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 hover:shadow-[0_8px_32px_rgba(79,110,247,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
                
                {/* Upper Details */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Bank Initials Circular Badge */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${getBankBadgeStyle(loan.bankColor)} shadow-sm`}>
                        {loan.providerName.slice(0, 3)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a1f36] text-base leading-tight">{loan.providerName}</h4>
                        <p className="text-xs text-[#718096] font-medium">{loan.productName}</p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        loan.matchScore >= 70 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        loan.matchScore >= 50 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {loan.matchScore}% Match
                      </span>
                    </div>
                  </div>

                  {/* Eligibility Status Pill */}
                  <div className="mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      loan.eligibilityStatus === 'High' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      loan.eligibilityStatus === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        loan.eligibilityStatus === 'High' ? 'bg-emerald-500' :
                        loan.eligibilityStatus === 'Medium' ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`} />
                      {loan.eligibilityStatus === 'High' ? 'Likely Eligible' :
                       loan.eligibilityStatus === 'Medium' ? 'Conditional' : 'Low Eligibility'}
                    </span>
                  </div>

                  {/* 3 Stat Boxes */}
                  <div className="grid grid-cols-3 gap-2.5 mb-6">
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl text-center">
                      <p className="text-[10px] text-[#718096] font-bold uppercase tracking-wider mb-1">Interest Rate</p>
                      <p className="font-bold text-sm text-[#1a1f36]">{loan.interestRate}</p>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl text-center">
                      <p className="text-[10px] text-[#718096] font-bold uppercase tracking-wider mb-1">Est. EMI</p>
                      <p className="font-bold text-sm text-[#4f6ef7]">{loan.emiEstimate}</p>
                    </div>
                    <div className="bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-xl text-center">
                      <p className="text-[10px] text-[#718096] font-bold uppercase tracking-wider mb-1">Tenure</p>
                      <p className="font-bold text-sm text-[#1a1f36]">{loan.tenureYears} Years</p>
                    </div>
                  </div>

                  {/* Eligibility Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-xs font-semibold text-[#718096] mb-1.5">
                      <span>CIBIL Fitment Score</span>
                      <span className="text-[#4f6ef7]">{loan.eligibilityScore}%</span>
                    </div>
                    <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          loan.eligibilityStatus === 'High' ? 'bg-emerald-500' :
                          loan.eligibilityStatus === 'Medium' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} 
                        style={{ width: `${loan.eligibilityScore}%` }} 
                      />
                    </div>
                  </div>

                  {/* AI Explanation Box */}
                  <p className="text-sm text-[#4a5568] leading-relaxed mb-6 bg-[#f8fafc] p-3.5 rounded-xl border border-[#cbd5e1]/30">
                    {loan.aiExplanation}
                  </p>

                  {/* Amber Warning Box (if CIBIL is low) */}
                  {loan.missingRequirements && loan.missingRequirements.length > 0 && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                      <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                      <div>
                        <p className="font-bold text-xs uppercase tracking-wider text-amber-900 mb-1">Eligibility Criteria Missing</p>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-amber-800">
                          {loan.missingRequirements.map((req: string, idx: number) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => window.open(applyUrl, '_blank')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-[#4f6ef7] to-[#7c3aed] hover:from-[#4f6ef7]/95 hover:to-[#7c3aed]/95 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-auto"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIDE BY SIDE COMPARISON MATRIX TABLE */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-6 border-b border-[#cbd5e1]/40 flex items-center gap-3">
          <div className="p-2 bg-[#f0f4ff] rounded-xl text-[#4f6ef7]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1a1f36]">Side by side comparison</h3>
            <p className="text-xs text-[#718096]">Transparent key loan parameters comparison matrix</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f8fafc] text-[#718096] font-bold text-xs uppercase border-b border-[#cbd5e1]/40">
                <th className="p-4 pl-6">Parameter</th>
                {recommendations.map((loan: any) => (
                  <th key={loan.id} className="p-4 font-bold text-[#1a1f36]">{loan.providerName}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-[#4a5568]">
              
              {/* Row 1: Interest Rate */}
              <tr>
                <td className="p-4 pl-6 font-bold text-[#1a1f36]">Interest Rate</td>
                {recommendations.map((loan: any) => {
                  const val = parseFloat(loan.interestRate);
                  const isBest = val === minRate;
                  return (
                    <td key={loan.id} className={`p-4 ${isBest ? 'bg-emerald-50 text-emerald-700 font-bold border-x border-emerald-100/50' : ''}`}>
                      {loan.interestRate} {isBest && '⚡ Best'}
                    </td>
                  );
                })}
              </tr>

              {/* Row 2: Max Amount */}
              <tr>
                <td className="p-4 pl-6 font-bold text-[#1a1f36]">Max Amount</td>
                {recommendations.map((loan: any) => {
                  const text = loan.maxAmountText || '';
                  let amountNum = 0;
                  if (text.includes('Cr')) amountNum = parseFloat(text.replace(/[^0-9.]/g, '')) * 100;
                  else amountNum = parseFloat(text.replace(/[^0-9.]/g, ''));
                  const isBest = amountNum === maxAmountVal;
                  return (
                    <td key={loan.id} className={`p-4 ${isBest ? 'bg-emerald-50 text-emerald-700 font-bold border-x border-emerald-100/50' : ''}`}>
                      {loan.maxAmountText}
                    </td>
                  );
                })}
              </tr>

              {/* Row 3: Tenure */}
              <tr>
                <td className="p-4 pl-6 font-bold text-[#1a1f36]">Tenure</td>
                {recommendations.map((loan: any) => (
                  <td key={loan.id} className="p-4">{loan.tenureYears} Years</td>
                ))}
              </tr>

              {/* Row 4: Min CIBIL */}
              <tr>
                <td className="p-4 pl-6 font-bold text-[#1a1f36]">Min CIBIL</td>
                {recommendations.map((loan: any) => {
                  const isBest = loan.minCibil === bestCibil;
                  return (
                    <td key={loan.id} className={`p-4 ${isBest ? 'bg-emerald-50 text-emerald-700 font-bold border-x border-emerald-100/50' : ''}`}>
                      {loan.minCibil}
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Processing Fee */}
              <tr>
                <td className="p-4 pl-6 font-bold text-[#1a1f36]">Processing Fee</td>
                {recommendations.map((loan: any) => {
                  const feeVal = parseFloat(loan.processingFeeText || '0');
                  const isBest = feeVal === minFee;
                  return (
                    <td key={loan.id} className={`p-4 ${isBest ? 'bg-emerald-50 text-emerald-700 font-bold border-x border-emerald-100/50' : ''}`}>
                      {loan.processingFeeText}
                    </td>
                  );
                })}
              </tr>

              {/* Row 6: Tax Benefit */}
              <tr>
                <td className="p-4 pl-6 font-bold text-[#1a1f36]">Tax Benefit</td>
                {recommendations.map((loan: any) => {
                  const text = loan.taxBenefitText || '';
                  const hasBenefit = text.includes('Sec');
                  return (
                    <td key={loan.id} className={`p-4 ${hasBenefit ? 'bg-emerald-50 text-emerald-700 font-bold border-x border-emerald-100/50' : ''}`}>
                      {loan.taxBenefitText}
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* HOW TO IMPROVE ELIGIBILITY TIPS CARD */}
      <div className="bg-[#f0f4ff] border border-[#dbeafe] rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4 text-[#1a1f36]">
          <HelpCircle className="w-6 h-6 text-[#4f6ef7]" />
          <h3 className="text-lg font-bold">How to improve your eligibility</h3>
        </div>
        
        <ul className="space-y-3">
          {getEligibilityTips().map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-[#4a5568] leading-relaxed">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
