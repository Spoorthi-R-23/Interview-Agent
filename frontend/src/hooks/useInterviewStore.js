import { create } from 'zustand';

const useInterviewStore = create((set) => ({
  sessionId: null,
  mode: 'technical',
  difficulty: 'medium',
  conversation: [],
  score: 0,
  maxScore: 0,
  overallSummary: '',
  setSession: ({ sessionId, mode, difficulty }) =>
    set({ sessionId, mode, difficulty, conversation: [], score: 0, maxScore: 0, overallSummary: '' }),
  addMessage: (message) =>
    set((state) => ({ conversation: [...state.conversation, message] })),
  updateMetrics: ({ score, maxScore, overallSummary, difficulty }) =>
    set((state) => ({
      score,
      maxScore,
      overallSummary: overallSummary || state.overallSummary,
      difficulty: difficulty || state.difficulty
    })),
  reset: () =>
    set({
      sessionId: null,
      mode: 'technical',
      conversation: [],
      score: 0,
      maxScore: 0,
      overallSummary: '',
      difficulty: 'medium'
    })
}));

export default useInterviewStore;
