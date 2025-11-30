import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import useInterviewStore from './useInterviewStore.js';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useInterviewSocket(sessionId) {
  const socketRef = useRef(null);
  const addMessage = useInterviewStore((state) => state.addMessage);
  const updateMetrics = useInterviewStore((state) => state.updateMetrics);

  useEffect(() => {
    if (!sessionId) return undefined;

    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    const socket = socketRef.current;

    socket.emit('interview:join', { sessionId });

    socket.on('interview:update', ({ sessionId: incomingSession, feedback, question, score, maxScore, overallSummary, difficulty, options, correctAnswer }) => {
      if (incomingSession !== sessionId) return;
      if (feedback) {
        addMessage({ sender: 'system', content: feedback });
      }
      if (question) {
        addMessage({ sender: 'interviewer', content: question, options, correctAnswer });
      }
      updateMetrics({ score, maxScore, overallSummary, difficulty });
    });

    socket.on('interview:error', (payload) => {
      addMessage({ sender: 'system', content: `⚠️ ${payload.message}` });
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId, addMessage, updateMetrics]);

  const sendMessage = (message) => {
    if (!socketRef.current || !sessionId) return;
    addMessage({ sender: 'candidate', content: message });
    socketRef.current.emit('interview:message', { sessionId, message });
  };

  return { sendMessage };
}
