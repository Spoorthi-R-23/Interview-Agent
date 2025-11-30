import { create } from 'zustand';

const TOKEN_KEY = 'interview-agent-token';

const initialToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

const useAuthStore = create((set) => ({
  user: null,
  token: initialToken,
  setCredentials: ({ user, token }) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    }
    set({ user, token });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
