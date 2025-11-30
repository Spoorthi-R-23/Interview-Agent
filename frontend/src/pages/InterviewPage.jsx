import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import InterviewChat from '../components/InterviewChat.jsx';
import InterviewSidebar from '../components/InterviewSidebar.jsx';
import { InterviewAPI } from '../services/apiClient.js';
import useInterviewStore from '../hooks/useInterviewStore.js';
import useAuthStore from '../hooks/useAuthStore.js';

const modes = [
  { key: 'hr', label: 'HR Round', description: 'Strengthen communication, motivations, and culture fit.' },
  {
    key: 'technical',
    label: 'Technical Round',
    description: 'Deep dive into algorithms, system design, and problem solving.'
  },
  {
    key: 'mcq',
    label: 'MCQ Round',
    description: 'Multiple choice questions to test your knowledge quickly.'
  }
];

function InterviewPage() {
  const [selectedMode, setSelectedMode] = useState('technical');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const {
    sessionId,
    setSession,
    addMessage,
    score,
    maxScore,
    difficulty,
    overallSummary,
    reset
  } = useInterviewStore();

  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [token, navigate]);

  const handleStart = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await InterviewAPI.startSession({ mode: selectedMode });
      setSession({ sessionId: data.sessionId, mode: selectedMode, difficulty: data.difficulty });
      addMessage({ 
        sender: 'interviewer', 
        content: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer
      });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setError(message);
      addMessage({ sender: 'system', content: `⚠️ Unable to start session: ${message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setError('');
    try {
      const summary = await InterviewAPI.complete(sessionId);
      addMessage({
        sender: 'system',
        content: `✅ Session complete! Final Score: ${summary.finalScore}/${summary.maxScore} (${summary.percentage}%).\n\nHighlights:\n${summary.highlights}\n\nGreat job! Click "Start New Interview" to continue practicing.`
      });
      setIsCompleted(true);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setError(message);
      addMessage({ sender: 'system', content: `⚠️ Unable to complete session: ${message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNew = () => {
    reset();
    setError('');
    setIsCompleted(false);
    setSelectedMode('technical');
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">AI Interview Room</h2>
          <p className="mt-2 text-sm text-slate-400">
            Choose a mode and begin your adaptive mock interview with real-time coaching and scoring.
          </p>
        </div>
        {!sessionId && (
          <button
            type="button"
            onClick={handleStart}
            disabled={isLoading}
            className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Preparing session...' : 'Launch Interview'}
          </button>
        )}
      </div>

      {!sessionId && (
        <div className="grid gap-4 md:grid-cols-3">
          {modes.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => setSelectedMode(mode.key)}
              className={`rounded-2xl border px-5 py-6 text-left transition hover:border-brand hover:shadow-card ${
                selectedMode === mode.key ? 'border-brand bg-brand/10 text-white' : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <p className="text-lg font-semibold">{mode.label}</p>
              <p className="mt-2 text-sm text-slate-400">{mode.description}</p>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/60 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {sessionId && !isCompleted && (
        <div className="mt-8 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <InterviewChat sessionId={sessionId} />
          <InterviewSidebar
            score={score}
            maxScore={maxScore}
            difficulty={difficulty}
            summary={overallSummary}
          />
        </div>
      )}

      {sessionId && isCompleted && (
        <div className="mt-8 rounded-3xl border border-green-500/60 bg-green-500/10 p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="text-2xl font-semibold text-white">🎉 Interview Complete!</h3>
            <div className="mt-4 space-y-2 text-left">
              <p className="text-lg text-slate-300">
                <strong>Final Score:</strong> {score}/{maxScore} ({maxScore > 0 ? Math.round((score / maxScore) * 100) : 0}%)
              </p>
              {overallSummary && (
                <div className="mt-4 rounded-xl bg-slate-900/50 p-4">
                  <p className="text-sm text-slate-400 whitespace-pre-wrap">{overallSummary}</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleStartNew}
              className="mt-6 rounded-md bg-brand px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
            >
              Start New Interview
            </button>
          </div>
        </div>
      )}

      {sessionId && !isCompleted && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleComplete}
            disabled={isLoading}
            className="rounded-md border border-slate-700 px-5 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:border-slate-800"
          >
            {isLoading ? 'Finishing...' : 'Complete Session'}
          </button>
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
