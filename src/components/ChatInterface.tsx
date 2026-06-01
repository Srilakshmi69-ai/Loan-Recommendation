import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import type { UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isError?: boolean;
}

interface ChatInterfaceProps {
  onComplete: (profile: UserProfile) => void;
  isLoading: boolean;
}

const QUESTIONS = [
  "Hi! I'm your AI Loan Assistant. To get started, what's your full name?",
  "Great to meet you! What is the primary purpose of the loan you're seeking?",
  "Understood. How much are you looking to borrow (in ₹)?",
  "What is your approximate monthly income (in ₹)?",
  "What is your current employment type?",
  "Do you know your approximate credit score? (300–900)",
  "Finally, what is the total amount you currently pay for existing EMIs each month (in ₹)?"
];

const STATE_KEYS: (keyof UserProfile)[] = [
  'name',
  'loanPurpose',
  'amount',
  'monthlyIncome',
  'employmentType',
  'creditScore',
  'existingEmi'
];

// --- Chip options for specific questions ---
const LOAN_PURPOSE_OPTIONS = ['Home Loan', 'Car Loan', 'Education', 'Business', 'Personal'];
const EMPLOYMENT_OPTIONS = ['Salaried', 'Self-employed', 'Business Owner', 'Freelancer'];
const CREDIT_SCORE_OPTIONS = ['300–500', '500–650', '650–750', '750–900'];

// --- Validation logic ---
function validateAnswer(step: number, value: string): string | null {
  const trimmed = value.trim();

  switch (step) {
    case 0: // Name — only letters and spaces
      if (!/^[a-zA-Z\s]{2,}$/.test(trimmed)) {
        return "That doesn't look right! I need your full name using only letters. Please try again.";
      }
      return null;

    case 1: // Loan Purpose — text only, no raw numbers
      if (/^\d+$/.test(trimmed)) {
        return "That doesn't look right! I need the purpose of your loan (e.g., Home, Car, Education, Business, Personal). Please try again.";
      }
      return null;

    case 2: // Amount — numbers only
      if (!/^\d[\d,]*$/.test(trimmed.replace(/₹/g, '').trim())) {
        return "That doesn't look right! I need a numeric loan amount (e.g., 500000 or 10,00,000). Please try again.";
      }
      return null;

    case 3: // Monthly Income — numbers only
      if (!/^\d[\d,]*$/.test(trimmed.replace(/₹/g, '').trim())) {
        return "That doesn't look right! I need your monthly income as a number (e.g., 75000). Please try again.";
      }
      return null;

    case 4: { // Employment Type — text only, no raw numbers
      const valid = ['salaried', 'self-employed', 'self employed', 'business', 'business owner', 'freelancer', 'freelance', 'contract', 'retired', 'student'];
      if (/^\d+$/.test(trimmed) || !valid.some(v => trimmed.toLowerCase().includes(v))) {
        return "That doesn't look right! I need your employment type (e.g., Salaried, Self-employed, Business Owner, Freelancer). Please try again.";
      }
      return null;
    }

    case 5: { // Credit Score — number between 300 and 900
      // Accept range chips like "750–900"
      const rangeMatch = trimmed.match(/^(\d{3})\s*[–\-]\s*(\d{3})$/);
      if (rangeMatch) return null; // chip selection is valid

      const num = parseInt(trimmed, 10);
      if (isNaN(num) || num < 300 || num > 900) {
        return "That doesn't look right! Credit scores range from 300 to 900. Please enter a valid number.";
      }
      return null;
    }

    case 6: // Existing EMI — numbers only (0 is valid)
      if (!/^\d[\d,]*$/.test(trimmed.replace(/₹/g, '').trim()) && trimmed !== '0') {
        return "That doesn't look right! I need your existing monthly EMI as a number (e.g., 15000 or 0 if none). Please try again.";
      }
      return null;

    default:
      return null;
  }
}

// --- Which steps show chips ---
function getChipsForStep(step: number): string[] | null {
  switch (step) {
    case 1: return LOAN_PURPOSE_OPTIONS;
    case 4: return EMPLOYMENT_OPTIONS;
    case 5: return CREDIT_SCORE_OPTIONS;
    default: return null;
  }
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onComplete, isLoading }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [chatDone, setChatDone] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ id: Date.now().toString(), sender: 'ai', text: QUESTIONS[0] }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const processAnswer = (userText: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    // Validate
    const error = validateAnswer(step, userText);
    if (error) {
      // Show error and re-ask the same question
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { id: (Date.now() + 1).toString(), sender: 'ai', text: error, isError: true },
          { id: (Date.now() + 2).toString(), sender: 'ai', text: QUESTIONS[step] }
        ]);
      }, 500);
      return;
    }

    // Save valid answer
    const currentKey = STATE_KEYS[step];
    const newProfile = { ...profile, [currentKey]: userText };
    setProfile(newProfile);

    // Next step or finish
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: QUESTIONS[step + 1] }]);
        setStep(step + 1);
      }, 600);
    } else {
      setChatDone(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Thank you! Analyzing your profile to find the best loan recommendations...' }]);
        onComplete(newProfile as UserProfile);
      }, 600);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || chatDone) return;
    const userText = inputValue.trim();
    setInputValue('');
    processAnswer(userText);
  };

  const handleChipClick = (chip: string) => {
    if (isLoading || chatDone) return;
    processAnswer(chip);
  };

  const chips = getChipsForStep(step);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden border border-[#e2e8f0]">
      {/* Header */}
      <div className="bg-white p-4 text-[#1a1f36] flex items-center shadow-sm border-b border-[#e2e8f0] relative z-10">
        <div className="p-2 bg-[#f0f4ff] rounded-xl text-[#4f6ef7] mr-3">
          <Bot className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-base text-[#1a1f36] tracking-tight">LoanAdvisor AI</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs text-[#718096] font-semibold">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === 'user' ? 'bg-[#e0e7ff] text-[#4f6ef7] ml-2.5' :
                  msg.isError ? 'bg-[#fee2e2] text-[#ef4444] mr-2.5' : 'bg-[#f0f4ff] text-[#4f6ef7] mr-2.5'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> :
                   msg.isError ? <AlertCircle className="w-4 h-4" /> :
                   <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 px-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                  msg.sender === 'user'
                    ? 'bg-[#eef2ff] border border-[#e0e7ff] text-[#1a1f36] rounded-tr-none font-medium'
                    : msg.isError
                      ? 'bg-[#fff5f5] border-l-4 border-l-[#f56565] border-y border-r border-[#fed7d7] text-[#c53030] rounded-tl-none font-medium'
                      : 'bg-white border-l-4 border-l-[#4f6ef7] border-y border-r border-[#e2e8f0] text-[#4a5568] rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex bg-white border border-[#e2e8f0] p-4 rounded-2xl rounded-tl-none shadow-[0_2px_8px_rgba(0,0,0,0.02)] ml-10">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-[#4f6ef7] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#4f6ef7] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-[#4f6ef7] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Chip Buttons */}
      {chips && !isLoading && !chatDone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-[#f8fafc] flex flex-wrap gap-2 border-t border-[#f1f5f9]"
        >
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#f0f4ff] hover:bg-[#e0e7ff] text-[#4f6ef7] border border-[#dbeafe] hover:scale-[1.02] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </motion.div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-[#f8fafc] border-t border-[#cbd5e1]/30">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || chatDone}
            placeholder={isLoading ? "Analyzing..." : "Type your answer here..."}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-[#cbd5e1] focus:border-[#4f6ef7] focus:ring-2 focus:ring-[#4f6ef7]/15 transition-all outline-none bg-white text-[#1a1f36] placeholder-[#94a3b8] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading || chatDone}
            className="absolute right-2 p-2 bg-[#4f6ef7] hover:bg-[#4f6ef7]/90 text-white rounded-lg disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
