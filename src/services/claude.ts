import type { UserProfile, LoanRecommendation } from '../types';

interface LoanDatabaseItem {
  providerName: string;
  productName: string;
  interestRate: number;
  maxAmount: number;
  tenureYears: number;
  minCibil: number;
  processingFee: string;
  taxBenefit: string;
  bankColor: 'green' | 'blue' | 'orange' | 'purple' | 'red' | 'teal';
}

const LOAN_DATABASE: Record<string, LoanDatabaseItem[]> = {
  Education: [
    { providerName: 'SBI', productName: 'Student Loan', interestRate: 8.15, maxAmount: 2000000, tenureYears: 15, minCibil: 650, processingFee: '0%', taxBenefit: 'Sec 80E Benefit', bankColor: 'green' },
    { providerName: 'HDFC', productName: 'Education Loan', interestRate: 10.50, maxAmount: 15000000, tenureYears: 15, minCibil: 680, processingFee: '1%', taxBenefit: 'Sec 80E Benefit', bankColor: 'blue' },
    { providerName: 'ICICI', productName: 'Education Loan', interestRate: 10.75, maxAmount: 30000000, tenureYears: 15, minCibil: 680, processingFee: '1%', taxBenefit: 'Sec 80E Benefit', bankColor: 'orange' },
    { providerName: 'Axis Bank', productName: 'Education Loan', interestRate: 13.70, maxAmount: 7500000, tenureYears: 15, minCibil: 660, processingFee: '1%', taxBenefit: 'Sec 80E Benefit', bankColor: 'purple' },
    { providerName: 'Bank of Baroda', productName: 'Scholar', interestRate: 8.85, maxAmount: 8000000, tenureYears: 15, minCibil: 650, processingFee: '0%', taxBenefit: 'Sec 80E Benefit', bankColor: 'red' }
  ],
  Personal: [
    { providerName: 'SBI', productName: 'Personal Loan', interestRate: 10.75, maxAmount: 2000000, tenureYears: 6, minCibil: 700, processingFee: '1%', taxBenefit: 'None', bankColor: 'green' },
    { providerName: 'HDFC', productName: 'Personal Loan', interestRate: 10.50, maxAmount: 4000000, tenureYears: 5, minCibil: 700, processingFee: '1.5%', taxBenefit: 'None', bankColor: 'blue' },
    { providerName: 'ICICI', productName: 'Personal Loan', interestRate: 10.75, maxAmount: 5000000, tenureYears: 6, minCibil: 700, processingFee: '1%', taxBenefit: 'None', bankColor: 'orange' },
    { providerName: 'Axis Bank', productName: 'Personal Loan', interestRate: 11, maxAmount: 4000000, tenureYears: 5, minCibil: 680, processingFee: '1.5%', taxBenefit: 'None', bankColor: 'purple' },
    { providerName: 'Kotak', productName: 'Personal Loan', interestRate: 10.99, maxAmount: 4000000, tenureYears: 5, minCibil: 700, processingFee: '1.5%', taxBenefit: 'None', bankColor: 'red' }
  ],
  Home: [
    { providerName: 'SBI', productName: 'Home Loan', interestRate: 8.50, maxAmount: 50000000, tenureYears: 30, minCibil: 700, processingFee: '0.35%', taxBenefit: 'Sec 24 & 80C', bankColor: 'green' },
    { providerName: 'HDFC', productName: 'Home Loan', interestRate: 8.70, maxAmount: 100000000, tenureYears: 30, minCibil: 700, processingFee: '0.5%', taxBenefit: 'Sec 24 & 80C', bankColor: 'blue' },
    { providerName: 'ICICI', productName: 'Home Loan', interestRate: 8.75, maxAmount: 50000000, tenureYears: 30, minCibil: 700, processingFee: '0.5%', taxBenefit: 'Sec 24 & 80C', bankColor: 'orange' },
    { providerName: 'Axis Bank', productName: 'Home Loan', interestRate: 8.75, maxAmount: 50000000, tenureYears: 30, minCibil: 700, processingFee: '0.5%', taxBenefit: 'Sec 24 & 80C', bankColor: 'purple' },
    { providerName: 'LIC Housing Finance', productName: 'Home Loan', interestRate: 8.50, maxAmount: 150000000, tenureYears: 30, minCibil: 680, processingFee: '0.25%', taxBenefit: 'Sec 24 & 80C', bankColor: 'teal' }
  ],
  Car: [
    { providerName: 'SBI', productName: 'Car Loan', interestRate: 8.75, maxAmount: 10000000, tenureYears: 7, minCibil: 680, processingFee: '0.51%', taxBenefit: 'None (except Business)', bankColor: 'green' },
    { providerName: 'HDFC', productName: 'Car Loan', interestRate: 8.80, maxAmount: 15000000, tenureYears: 7, minCibil: 700, processingFee: '0.5%', taxBenefit: 'None (except Business)', bankColor: 'blue' },
    { providerName: 'ICICI', productName: 'Car Loan', interestRate: 8.85, maxAmount: 10000000, tenureYears: 7, minCibil: 680, processingFee: '0.75%', taxBenefit: 'None (except Business)', bankColor: 'orange' },
    { providerName: 'Axis Bank', productName: 'Car Loan', interestRate: 9.20, maxAmount: 15000000, tenureYears: 7, minCibil: 680, processingFee: '0.5%', taxBenefit: 'None (except Business)', bankColor: 'purple' }
  ],
  Business: [
    { providerName: 'SBI', productName: 'Business Loan', interestRate: 11.20, maxAmount: 10000000, tenureYears: 5, minCibil: 700, processingFee: '1%', taxBenefit: 'Interest Tax Deductible', bankColor: 'green' },
    { providerName: 'HDFC', productName: 'Business Loan', interestRate: 10.75, maxAmount: 15000000, tenureYears: 4, minCibil: 700, processingFee: '1.5%', taxBenefit: 'Interest Tax Deductible', bankColor: 'blue' },
    { providerName: 'ICICI', productName: 'Business Loan', interestRate: 11.50, maxAmount: 20000000, tenureYears: 5, minCibil: 700, processingFee: '1%', taxBenefit: 'Interest Tax Deductible', bankColor: 'orange' },
    { providerName: 'Axis Bank', productName: 'Business Loan', interestRate: 11.25, maxAmount: 15000000, tenureYears: 5, minCibil: 680, processingFee: '1%', taxBenefit: 'Interest Tax Deductible', bankColor: 'purple' }
  ]
};

// Exact EMI calculation formula
const calculateEMI = (principal: number, annualRate: number, years: number): number => {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
};

export async function getLoanRecommendations(profile: UserProfile): Promise<LoanRecommendation[]> {
  // Parse inputs
  const rawAmount = parseInt(profile.amount?.replace(/[^0-9]/g, '') || '500000', 10);
  const rawIncome = parseInt(profile.monthlyIncome?.replace(/[^0-9]/g, '') || '75000', 10);
  const rawCibil = parseInt(profile.creditScore?.replace(/[^0-9]/g, '') || '700', 10);

  // Match category strictly
  const purpose = (profile.loanPurpose || '').toLowerCase();
  let category = 'Personal';
  if (purpose.includes('edu') || purpose.includes('stud') || purpose.includes('college') || purpose.includes('school')) {
    category = 'Education';
  } else if (purpose.includes('hom') || purpose.includes('hous') || purpose.includes('flat') || purpose.includes('prop')) {
    category = 'Home';
  } else if (purpose.includes('car') || purpose.includes('veh') || purpose.includes('auto') || purpose.includes('bike')) {
    category = 'Car';
  } else if (purpose.includes('bus') || purpose.includes('owner') || purpose.includes('enter') || purpose.includes('company') || purpose.includes('shop')) {
    category = 'Business';
  } else if (purpose.includes('pers') || purpose.includes('med') || purpose.includes('trav') || purpose.includes('wed') || purpose.includes('vac') || purpose.includes('marri') || purpose.includes('health') || purpose.includes('emerg') || purpose.includes('other')) {
    category = 'Personal';
  }

  const dbProducts = LOAN_DATABASE[category] || LOAN_DATABASE.Personal;

  const recommendations = dbProducts.map((prod, index) => {
    // Principal to borrow (cap at bank max allowed amount)
    const principal = Math.min(rawAmount, prod.maxAmount);

    // Calculate exact EMI
    const emi = calculateEMI(principal, prod.interestRate, prod.tenureYears);

    // Determine CIBIL eligibility
    let eligibilityStatus: 'High' | 'Medium' | 'Low' = 'High';
    let eligibilityScore = 100;
    const missingRequirements: string[] = [];

    if (rawCibil < prod.minCibil) {
      const diff = prod.minCibil - rawCibil;
      if (diff > 50) {
        eligibilityStatus = 'Low';
        eligibilityScore = Math.max(20, Math.round(100 - (diff * 1.2)));
      } else {
        eligibilityStatus = 'Medium';
        eligibilityScore = Math.round(100 - (diff * 1.0));
      }
      missingRequirements.push(`Requires a minimum CIBIL score of ${prod.minCibil} (You have ${rawCibil}).`);
    } else {
      eligibilityScore = Math.round(Math.min(100, 70 + ((rawCibil - prod.minCibil) * 0.3)));
    }

    // Check 40% EMI rule
    const maxAllowedEmi = rawIncome * 0.4;
    if (emi > maxAllowedEmi) {
      eligibilityScore = Math.max(30, eligibilityScore - 15);
      if (eligibilityStatus === 'High') eligibilityStatus = 'Medium';
      missingRequirements.push(`The monthly EMI (₹${emi.toLocaleString('en-IN')}) exceeds 40% of your net monthly income (₹${Math.round(maxAllowedEmi).toLocaleString('en-IN')}).`);
    }

    // Match Score
    let matchScore = eligibilityScore;
    if (prod.providerName === 'SBI' && rawCibil >= prod.minCibil) {
      matchScore = Math.min(98, matchScore + 3); // Public banks highly preferred
    }

    // Customized AI explanation
    let aiExplanation = '';
    if (eligibilityStatus === 'High') {
      aiExplanation = `Excellent match! Your solid credit profile of ${rawCibil} comfortably fulfills ${prod.providerName}'s requirements. The EMI of ₹${emi.toLocaleString('en-IN')} fits nicely within your dynamic budget.`;
    } else if (eligibilityStatus === 'Medium') {
      aiExplanation = `Strong choice, with a couple of conditional factors. ${prod.providerName} offers a competitive rate of ${prod.interestRate}% p.a., but you might want to structure a slightly longer tenure or reduce amount to fit the 40% income guidelines.`;
    } else {
      aiExplanation = `We recommend building your credit standing before applying to ${prod.providerName}. Their strict minimum CIBIL score of ${prod.minCibil} is higher than your current score of ${rawCibil}.`;
    }

    return {
      id: `loan-${category.toLowerCase()}-${index}`,
      providerName: prod.providerName,
      productName: prod.productName,
      matchScore: matchScore,
      emiEstimate: `₹${emi.toLocaleString('en-IN')}/mo`,
      interestRate: `${prod.interestRate}% p.a.`,
      eligibilityStatus: eligibilityStatus,
      keyFeatures: [
        `Processing fee of only ${prod.processingFee}`,
        `Max limit up to ₹${(prod.maxAmount >= 10000000) ? (prod.maxAmount / 10000000) + ' Cr' : (prod.maxAmount / 100000) + ' Lakhs'}`,
        `${prod.taxBenefit !== 'None' ? prod.taxBenefit : 'No collateral required'}`
      ],
      // Enhanced properties
      maxAmountText: prod.maxAmount >= 10000000 ? `₹${prod.maxAmount / 10000000} Cr` : `₹${prod.maxAmount / 100000}L`,
      tenureYears: prod.tenureYears,
      minCibil: prod.minCibil,
      processingFeeText: prod.processingFee,
      taxBenefitText: prod.taxBenefit,
      aiExplanation: aiExplanation,
      missingRequirements: missingRequirements.length > 0 ? missingRequirements : undefined,
      eligibilityScore: matchScore,
      bankColor: prod.bankColor
    } as LoanRecommendation & {
      maxAmountText: string;
      tenureYears: number;
      minCibil: number;
      processingFeeText: string;
      taxBenefitText: string;
      aiExplanation: string;
      missingRequirements?: string[];
      eligibilityScore: number;
      bankColor: string;
    };
  });

  // Sort by highest match score
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recommendations.sort((a, b) => b.matchScore - a.matchScore));
    }, 1200);
  });
}
