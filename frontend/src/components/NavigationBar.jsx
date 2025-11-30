import { Link, NavLink } from 'react-router-dom';

import useAuthStore from '../hooks/useAuthStore.js';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/interview', label: 'Start Interview' },
  { to: '/auth', label: 'Auth' }
];

function NavigationBar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-slate-950/80 border-b border-slate-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-semibold text-brand">
          Interview Agent
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `transition hover:text-brand-light ${isActive ? 'text-brand' : 'text-slate-300'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand hover:text-brand"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-md border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand hover:text-brand"
            >
              Sign in
            </Link>
          )}
          <Link
            to="/interview"
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/40 transition hover:bg-brand-dark"
          >
            Launch Agent
          </Link>
        </div>
      </div>
    </header>
  );
}

export default NavigationBar;
