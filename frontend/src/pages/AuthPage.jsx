import { useState } from 'react';
import useAuthStore from '../hooks/useAuthStore.js';
import { AuthAPI } from '../services/apiClient.js';

function AuthPage() {
  const [mode, setMode] = useState('login');
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handleChange = (event) => {
    setFormValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Processing...');

    try {
      if (mode === 'login') {
        await AuthAPI.login({ email: formValues.email, password: formValues.password });
      } else {
        await AuthAPI.register(formValues);
      }
      setStatus('Success! Redirect to dashboard or start interviewing.');
    } catch (error) {
      setStatus(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold text-white">You are signed in as {user.name}</h2>
        <button
          type="button"
          onClick={logout}
          className="mt-6 rounded-md border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand hover:text-brand"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8">
        <div className="mb-6 flex gap-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-brand text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${
              mode === 'register' ? 'bg-brand text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-400">Full Name</label>
              <input
                required
                name="name"
                autoComplete="name"
                value={formValues.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Email</label>
            <input
              type="email"
              required
              name="email"
              autoComplete="email"
              value={formValues.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Password</label>
            <input
              type="password"
              required
              minLength={8}
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={formValues.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        {status && <p className="mt-4 text-center text-xs text-slate-400">{status}</p>}
      </div>
    </div>
  );
}

export default AuthPage;
