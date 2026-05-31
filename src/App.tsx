import React, { useState } from 'react';
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

  const handleChatComplete = async (profile: UserProfile) => {
    setIsFetching(true);
    setError(null);
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
  };

  return (
    <div 
      className="min-h-screen bg-gray-900 flex flex-col font-sans text-gray-900 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col relative z-10">
        <header className="mb-8 text-center mt-4">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 mb-4"
          >
            <Sparkles className="w-6 h-6 text-blue-300 mr-2" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              LoanGenius
            </h1>
          </motion.div>
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md"
          >
            Discover Your Perfect Loan
          </motion.h2>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-50 max-w-2xl mx-auto drop-shadow-sm font-medium text-lg"
          >
            Chat with our AI assistant to get highly personalized loan recommendations tailored to your unique financial profile.
          </motion.p>
        </header>

        <div className="flex-1 w-full max-w-3xl mx-auto relative flex flex-col">
          <AnimatePresence mode="wait">
            {!recommendations ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="flex-1 w-full flex flex-col h-[600px] mb-12"
              >
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                  </div>
                )}
                <ChatInterface onComplete={handleChatComplete} isLoading={isFetching} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full pb-12"
              >
                <button
                  onClick={handleReset}
                  className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Start Over
                </button>
                <RecommendationCards recommendations={recommendations} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
