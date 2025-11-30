import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InterviewAPI } from '../services/apiClient.js';
import useAuthStore from '../hooks/useAuthStore.js';

function DashboardPage() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState('');
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    InterviewAPI.listSessions()
      .then((data) => setSessions(data))
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      });
  }, [token, navigate]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-8">
        <h2 className="text-3xl font-semibold text-white">Candidate Dashboard</h2>
        <p className="mt-2 text-sm text-slate-400">Track interview sessions, scores, and improvement history.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {sessions.map((session) => (
          <div key={session._id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">{session.mode} round</p>
              <span className="text-xs text-slate-500">{new Date(session.startedAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-white">Score: {session.score} / {session.maxScore || 1}</p>
            <p className="mt-3 text-sm text-slate-400 whitespace-pre-line">
              {session.feedbackSummary || 'Complete the session to receive feedback.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-slate-800 px-3 py-1">Status: {session.status}</span>
              <span className="rounded-full border border-slate-800 px-3 py-1">Difficulty: {session.difficulty}</span>
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
            Launch your first mock interview to see live analytics and personalized summaries here.
          </div>
        )}
        {error && (
          <div className="rounded-3xl border border-red-500/60 bg-red-500/10 p-6 text-sm text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
