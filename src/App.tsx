

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { RecommendationCards } from './components/RecommendationCards';
import { getLoanRecommendations } from './services/claude';
import type { UserProfile, LoanRecommendation } from './types';

function App() {
  const [recommendations, setRecommendations] = useState<LoanRecommendation[] | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleChatComplete = async (profile: UserProfile) => {
    setIsFetching(true);
    setError(null);
    setUserProfile(profile);
    try {
      const recs = await getLoanRecommendations(profile);
      setRecommendations(recs);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleReset = () => {
    setRecommendations(null);
    setError(null);
    setUserProfile(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#e8f0fe] to-[#f5f0ff] flex flex-col font-sans text-[#4a5568] relative overflow-hidden">
      
      {/* Subtle Floating Pastel Blur Blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-300/15 rounded-full blur-[120px] pointer-events-none z-0 animate-blob-1" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-300/15 rounded-full blur-[120px] pointer-events-none z-0 animate-blob-2" />

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto p-4 md:p-8 flex flex-col relative z-10">
        
        {/* Header Section */}
        <header className="mb-10 text-center mt-6">
          <motion.div 
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center p-2 px-4 bg-white/60 backdrop-blur-md rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-white/80 mb-4"
          >
            <Sparkles className="w-5 h-5 text-[#4f6ef7] mr-2" />
            <h1 className="text-sm font-bold text-[#1a1f36] tracking-tight uppercase">
              LoanGenius AI
            </h1>
          </motion.div>
          
          <motion.h2 
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-3xl md:text-5xl font-extrabold text-[#1a1f36] mb-3 tracking-tight"
          >
            Discover Your Perfect Loan
          </motion.h2>
          
          <motion.p 
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-[#718096] max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium"
          >
            Chat with our AI assistant to instantly retrieve highly customized loan options matched across leading lenders.
          </motion.p>
        </header>

        {/* Content Wrapper */}
        <div className={`flex-1 w-full mx-auto relative flex flex-col ${recommendations ? 'max-w-5xl' : 'max-w-2xl'}`}>
          <AnimatePresence mode="wait">
            {!recommendations ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="flex-1 w-full flex flex-col h-[580px] mb-12"
              >
                {error && (
                  <div className="mb-4 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 text-sm font-semibold flex items-center shadow-sm">
                    {error}
                  </div>
                )}
                <ChatInterface onComplete={handleChatComplete} isLoading={isFetching} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full pb-12"
              >
                <div className="flex justify-start mb-6">
                  <button
                    onClick={handleReset}
                    className="flex items-center text-xs font-bold text-[#4f6ef7] hover:text-[#4f6ef7]/80 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-[#e2e8f0] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                    Start New Inquiry
                  </button>
                </div>
                
                <RecommendationCards 
                  recommendations={recommendations} 
                  userProfile={userProfile} 
                  onApply={(loan) => console.log('applied', loan)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
