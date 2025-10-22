
import React, { useState, useCallback } from 'react';
import { AnalysisResult, ChatMessage } from './types';
import { analyzeReviews, initializeChat } from './services/geminiService';
import SentimentChart from './components/SentimentChart';
import WordCloud from './components/WordCloud';
import ExecutiveSummary from './components/ExecutiveSummary';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  const [reviewsText, setReviewsText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isThinkingMode, setIsThinkingMode] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isChatInitialized, setIsChatInitialized] = useState<boolean>(false);

  const handleAnalyzeClick = useCallback(async () => {
    if (!reviewsText.trim()) {
      setError('Please paste some reviews first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setIsChatInitialized(false);

    try {
      const result = await analyzeReviews(reviewsText, isThinkingMode);
      setAnalysisResult(result);
      const chatContext = `
        --- START OF REVIEWS ---
        ${reviewsText}
        --- END OF REVIEWS ---
        
        --- START OF AI SUMMARY ---
        ${result.summary}
        --- END OF AI SUMMARY ---
      `;
      initializeChat(chatContext);
      setIsChatInitialized(true);
    } catch (e) {
      console.error(e);
      setError('An error occurred during analysis. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [reviewsText, isThinkingMode]);

  const placeholderText = `Paste your customer reviews here. One review per line for best results.

Example:
The app is amazing, so easy to use!
I had trouble finding the settings page.
The new update is great, but it crashes sometimes.
Customer support was very helpful and resolved my issue quickly.`;

  return (
    <div className="min-h-screen bg-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 text-center">Customer Sentiment Dashboard</h1>
          <p className="text-center text-slate-600 mt-2">
            Use Gemini to instantly analyze reviews and uncover actionable insights.
          </p>
        </header>

        <main>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">1. Paste Your Reviews</h2>
            <textarea
              className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 resize-y text-slate-700 bg-slate-50"
              placeholder={placeholderText}
              value={reviewsText}
              onChange={(e) => setReviewsText(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <div className="flex items-center space-x-3 self-start sm:self-center">
                <label htmlFor="thinking-mode" className="font-medium text-slate-700">Thinking Mode</label>
                <button
                  id="thinking-mode"
                  onClick={() => setIsThinkingMode(!isThinkingMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isThinkingMode ? 'bg-sky-600' : 'bg-slate-300'}`}
                  disabled={isLoading}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isThinkingMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <p className="text-sm text-slate-500">
                  For complex queries. Uses {isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash'}.
                </p>
              </div>
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="w-full sm:w-auto bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 ease-in-out disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
             {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>

          {analysisResult && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <ExecutiveSummary summary={analysisResult.summary} />
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Sentiment Trend</h3>
                <SentimentChart data={analysisResult.sentimentTrend} />
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Top Praises</h3>
                <WordCloud words={analysisResult.wordCloud.praises} />
              </div>
              <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Top Complaints</h3>
                <WordCloud words={analysisResult.wordCloud.complaints} />
              </div>
            </div>
          )}
        </main>
        
        {isChatInitialized && <Chatbot />}
      </div>
    </div>
  );
};

export default App;
