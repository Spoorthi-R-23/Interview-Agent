import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import { InterviewAPI } from '../services/apiClient.js';
import useInterviewStore from '../hooks/useInterviewStore.js';
import { useInterviewSocket } from '../hooks/useInterviewSocket.js';
import ChatMessage from './ChatMessage.jsx';
import MicrophoneButton from './MicrophoneButton.jsx';

function InterviewChat({ sessionId }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const conversation = useInterviewStore((state) => state.conversation);
  const addMessage = useInterviewStore((state) => state.addMessage);
  const updateMetrics = useInterviewStore((state) => state.updateMetrics);
  const messagesEndRef = useRef(null);

  const { sendMessage } = useInterviewSocket(sessionId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleMCQSubmit = (event) => {
    event.preventDefault();
    if (!selectedOption) return;
    sendMessage(selectedOption);
    setSelectedOption('');
    setCurrentQuestion(null);
  };

  const handleAudioComplete = async (file) => {
    if (!sessionId) return;

    addMessage({ sender: 'system', content: 'Transcribing audio...' });
    try {
      const data = await InterviewAPI.uploadAudio({ sessionId, file });
      addMessage({ sender: 'candidate', content: data.transcript });
      if (data.feedback) {
        addMessage({ sender: 'system', content: data.feedback });
      }
      if (data.question) {
        addMessage({ sender: 'interviewer', content: data.question });
      }
      updateMetrics({
        score: data.score,
        maxScore: data.maxScore,
        overallSummary: data.overallSummary,
        difficulty: data.difficulty
      });
    } catch (error) {
      addMessage({ sender: 'system', content: `⚠️ Audio upload failed: ${error.message}` });
    }
  };

  // Check if the last message is an MCQ question
  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1];
    if (lastMessage && lastMessage.sender === 'interviewer' && lastMessage.options) {
      setCurrentQuestion(lastMessage);
    } else {
      setCurrentQuestion(null);
    }
  }, [conversation]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {conversation.map((message, index) => (
          <ChatMessage key={`${message.sender}-${index}-${message.content.slice(0, 8)}`} {...message} />
        ))}
        <span ref={messagesEndRef} />
      </div>
      
      {currentQuestion && currentQuestion.options ? (
        <form onSubmit={handleMCQSubmit} className="mt-6 space-y-3">
          <div className="grid gap-2">
            {currentQuestion.options.map((option, idx) => {
              const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
              return (
                <label
                  key={idx}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    selectedOption === optionLetter
                      ? 'border-brand bg-brand/10 text-white'
                      : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="mcq-option"
                    value={optionLetter}
                    checked={selectedOption === optionLetter}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-sm">
                    <strong>{optionLetter}.</strong> {option}
                  </span>
                </label>
              );
            })}
          </div>
          <button
            type="submit"
            disabled={!selectedOption}
            className="w-full rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Answer
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Type your response..."
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-brand focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            Send Reply
          </button>
        </form>
      )}
    </div>
  );
}

InterviewChat.propTypes = {
  sessionId: PropTypes.string
};

export default InterviewChat;
