import axios from 'axios';

import useAuthStore from '../hooks/useAuthStore.js';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || '/api' });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthAPI = {
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    useAuthStore.getState().setCredentials(data);
    return data;
  },
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    useAuthStore.getState().setCredentials(data);
    return data;
  },
  async me() {
    const { data } = await api.get('/auth/me');
    useAuthStore.setState({ user: data.user });
    return data.user;
  }
};

export const InterviewAPI = {
  async startSession({ mode }) {
    const { data } = await api.post('/interview/start', { mode });
    return data;
  },
  async sendMessage({ sessionId, message }) {
    const { data } = await api.post('/interview/respond', { sessionId, message });
    return data;
  },
  async uploadAudio({ sessionId, file }) {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('audio', file);
    const { data } = await api.post('/interview/respond-audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
  async complete(sessionId) {
    const { data } = await api.post('/interview/complete', { sessionId });
    return data;
  },
  async listSessions() {
    const { data } = await api.get('/interview/sessions');
    return data.sessions;
  },
  async getSession(sessionId) {
    const { data } = await api.get(`/interview/${sessionId}`);
    return data.session;
  }
};

export const CalendarAPI = {
  schedule(payload) {
    return api.post('/calendar/schedule', payload);
  },
  cancel(eventId) {
    return api.delete(`/calendar/schedule/${eventId}`);
  }
};

export const SheetsAPI = {
  publish(payload) {
    return api.post('/sheets/publish', payload);
  }
};

export default api;
