export interface UserProfile {
  name: string;
  loanPurpose: string;
  amount: string;
  monthlyIncome: string;
  employmentType: string;
  creditScore: string;
  existingEmi: string;
}

export interface LoanRecommendation {
  id: string;
  providerName: string;
  productName: string;
  matchScore: number;
  emiEstimate: string;
  interestRate: string;
  eligibilityStatus: 'High' | 'Medium' | 'Low';
  keyFeatures: string[];
}
