import type { UserProfile, LoanRecommendation } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getLoanRecommendations(profile: UserProfile): Promise<LoanRecommendation[]> {
  // Dynamic EMI Calculation function
  const calculateEMI = (principal: number, annualRate: number, months: number): number => {
    const r = annualRate / 12 / 100;
    const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
  };

  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_api_key_here') {
    console.warn('Groq API key is missing. Using dynamically calculated mock data.');

    // Parse user inputs safely
    const principal = parseInt(profile.amount?.replace(/[^0-9]/g, '') || '500000', 10);
    const creditScore = parseInt(profile.creditScore || '700', 10);

    // Determine realistic 2026 interest rates based on credit score
    // Current 2026 rates: HDFC (9.99% - 24%), SBI (10.00% - 15%), ICICI (9.99% - 16.5%)
    const hdfcRate = creditScore >= 750 ? 9.99 : creditScore >= 700 ? 11.50 : 14.50;
    const sbiRate = creditScore >= 750 ? 10.00 : creditScore >= 700 ? 11.00 : 13.50;
    const iciciRate = creditScore >= 750 ? 9.99 : creditScore >= 700 ? 11.25 : 14.00;

    // Calculate real EMIs for 5 years (60 months)
    const emi1 = calculateEMI(principal, hdfcRate, 60);
    const emi2 = calculateEMI(principal, sbiRate, 60);
    const emi3 = calculateEMI(principal, iciciRate, 60);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'loan-1',
            providerName: 'HDFC Bank',
            productName: 'Personal Loan',
            matchScore: creditScore >= 750 ? 98 : creditScore >= 700 ? 85 : 70,
            emiEstimate: `₹${emi1.toLocaleString('en-IN')}/mo`,
            interestRate: `${hdfcRate}% p.a.`,
            eligibilityStatus: creditScore >= 750 ? 'High' : creditScore >= 700 ? 'Medium' : 'Low',
            keyFeatures: ['Rates starting 9.99% in 2026', 'Zero hidden charges', 'Calculated for 60 months']
          },
          {
            id: 'loan-2',
            providerName: 'SBI',
            productName: 'Xpress Credit',
            matchScore: creditScore >= 750 ? 95 : creditScore >= 700 ? 82 : 65,
            emiEstimate: `₹${emi2.toLocaleString('en-IN')}/mo`,
            interestRate: `${sbiRate}% p.a.`,
            eligibilityStatus: creditScore >= 750 ? 'High' : creditScore >= 700 ? 'Medium' : 'Low',
            keyFeatures: ['Trusted public sector rates', 'No security required', 'Calculated for 60 months']
          },
          {
            id: 'loan-3',
            providerName: 'ICICI Bank',
            productName: 'Personal Loan',
            matchScore: creditScore >= 750 ? 92 : creditScore >= 700 ? 80 : 60,
            emiEstimate: `₹${emi3.toLocaleString('en-IN')}/mo`,
            interestRate: `${iciciRate}% p.a.`,
            eligibilityStatus: creditScore >= 750 ? 'High' : creditScore >= 700 ? 'Medium' : 'Low',
            keyFeatures: ['Minimal documentation', 'Instant disbursal', 'Calculated for 60 months']
          }
        ]);
      }, 2000);
    });
  }

  const prompt = `
You are a highly analytical financial advisor and loan recommendation engine.
Based on the following user profile, recommend 3 realistic loan products from actual Indian banks (e.g., SBI, HDFC, ICICI, Bajaj Finserv). 

CURRENT 2026 INTEREST RATES CONTEXT:
Use these real-world 2026 interest rates for your recommendations depending on the user's credit score:
- SBI Personal Loan: 10.00% to 15.00% p.a.
- HDFC Bank Personal Loan: 9.99% to 24.00% p.a.
- ICICI Bank Personal Loan: 9.99% to 16.50% p.a.
Adjust the rate you select based on their credit score (e.g., give ~9.99%-10.5% for >750, ~11-12% for 700-750).

CRITICAL CALCULATION INSTRUCTION:
Do not guess the EMI. You MUST calculate the exact monthly EMI using the standard formula: E = P * R * (1+R)^N / ((1+R)^N - 1)
Where P = principal amount, R = monthly interest rate (annual rate / 12 / 100), and N = total number of months. 
Assume a loan tenure of 5 years (60 months) unless the user profile suggests otherwise.
All monetary values must be in Indian Rupees (₹).

Respond ONLY with a valid JSON array of objects representing the recommendations. 
Do not include markdown blocks, preamble, or postscript. Just the JSON array.

The JSON schema for each object should be:
{
  "id": "unique string id",
  "providerName": "Bank or provider name",
  "productName": "Name of the loan product",
  "matchScore": number (0-100),
  "emiEstimate": "Estimated EMI string in Indian Rupees (e.g. '₹35,000/mo')",
  "interestRate": "Interest rate string (e.g. '9.99% p.a.')",
  "eligibilityStatus": "High" | "Medium" | "Low",
  "keyFeatures": ["string array of 3 key features"]
}

User Profile:
Name: ${profile.name}
Loan Purpose: ${profile.loanPurpose}
Amount: ${profile.amount}
Monthly Income: ${profile.monthlyIncome}
Employment Type: ${profile.employmentType}
Credit Score: ${profile.creditScore}
Existing EMI: ${profile.existingEmi}
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a financial advisor AI. Output only valid JSON. No markdown, no explanation.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.choices[0].message.content;

    // Parse JSON
    try {
      const recommendations: LoanRecommendation[] = JSON.parse(textResponse);
      return recommendations;
    } catch (parseError) {
      console.error('Failed to parse Groq response as JSON', textResponse);
      throw new Error('Failed to parse recommendations from API response.');
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}
