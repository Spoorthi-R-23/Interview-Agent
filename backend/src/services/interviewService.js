import { runInterviewAgent } from './gptService.js';
import { updateScores, computeFinalSummary } from './scoringService.js';
import { appendInterviewSummary } from './sheetsService.js';
import { logger } from '../utils/logger.js';

// In-memory session store
const sessions = new Map();

export async function startInterviewSession({ userId, mode }) {
  const sessionId = `session-${Date.now()}`;
  
  // For MCQ mode, set a fixed number of questions and maxScore
  const totalQuestions = mode === 'mcq' ? 10 : null;
  const session = {
    _id: sessionId,
    user: userId,
    mode,
    status: 'in-progress',
    difficulty: 'medium',
    score: 0,
    maxScore: mode === 'mcq' ? totalQuestions * 5 : 0,
    conversation: [],
    startedAt: new Date(),
    questionCount: 0,
    totalQuestions: totalQuestions
  };

  try {
    const agentResponse = await runInterviewAgent({
      mode,
      difficulty: 'medium',
      conversation: [],
      userMessage: 'The candidate is ready to begin. Provide the first question.'
    });

    session.conversation.push({ sender: 'interviewer', content: agentResponse.question });
    session.difficulty = agentResponse.difficulty;
    
    sessions.set(sessionId, session);
    logger.info('Interview session started (in-memory)', { sessionId, mode });

    return {
      sessionId: session._id,
      question: agentResponse.question,
      difficulty: agentResponse.difficulty,
      // Include MCQ specific data if present
      options: agentResponse.options,
      correctAnswer: agentResponse.correctAnswer
    };
  } catch (error) {
    logger.error('Failed to start interview session', { error: error.message });
    throw error;
  }
}

export async function processCandidateMessage({ sessionId, message }) {
  const session = sessions.get(sessionId);
  if (!session) {
    const error = new Error('Session not found');
    error.status = 404;
    throw error;
  }
  if (session.status !== 'in-progress') {
    const error = new Error('Session is not active');
    error.status = 400;
    throw error;
  }

  try {
    // For MCQ mode, check if the session is complete
    if (session.mode === 'mcq') {
      session.questionCount = (session.questionCount || 0) + 1;
      if (session.questionCount > session.totalQuestions) {
        session.status = 'completed';
        sessions.set(sessionId, session);
        return { completed: true, score: session.score, maxScore: session.maxScore };
      }
    }

    const agentResponse = await runInterviewAgent({
      mode: session.mode,
      difficulty: session.difficulty,
      conversation: session.conversation,
      userMessage: message
    });

    session.conversation.push({ sender: 'candidate', content: message });

    // For MCQ, do not increment maxScore per question
    const { score } = updateScores(
      session.score,
      session.maxScore,
      agentResponse.scoreDelta
    );

    session.score = score;
    session.difficulty = agentResponse.difficulty;
    session.conversation.push({ sender: 'system', content: agentResponse.feedback, scoreDelta: agentResponse.scoreDelta, feedback: agentResponse.feedback });
    session.conversation.push({ sender: 'interviewer', content: agentResponse.question });
    
    sessions.set(sessionId, session);

    return {
      question: agentResponse.question,
      feedback: agentResponse.feedback,
      score,
      maxScore: session.maxScore,
      difficulty: agentResponse.difficulty,
      overallSummary: agentResponse.overallSummary,
      questionCount: session.questionCount,
      totalQuestions: session.totalQuestions,
      // Include MCQ specific data if present
      options: agentResponse.options,
      correctAnswer: agentResponse.correctAnswer
    };
  } catch (error) {
    logger.error('Failed to process candidate message', { sessionId, error: error.message });
    throw error;
  }
}

export async function endInterviewSession(sessionId) {
  const session = sessions.get(sessionId);
  if (!session) {
    const error = new Error('Session not found');
    error.status = 404;
    throw error;
  }

  session.status = 'completed';
  session.endedAt = new Date();

  const summary = computeFinalSummary(session);

  const sheetsRange = await appendInterviewSummary({
    candidate: 'Demo User',
    mode: session.mode,
    score: summary.finalScore,
    maxScore: summary.maxScore,
    percentage: summary.percentage,
    highlights: summary.highlights,
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  });

  session.sheetsRowId = sheetsRange;
  sessions.set(sessionId, session);
  logger.info('Interview session completed (in-memory)', { sessionId });

  return summary;
}

export async function recordFeedback({ sessionId, feedback }) {
  const session = sessions.get(sessionId);
  if (!session) {
    const error = new Error('Session not found');
    error.status = 404;
    throw error;
  }

  session.feedbackSummary = feedback.map((item) => `${item.category}: ${item.comments}`).join('\n');
  sessions.set(sessionId, session);

  return feedback;
}

export async function listSessionsByUser(userId) {
  const userSessions = Array.from(sessions.values())
    .filter(session => session.user === userId)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  
  return userSessions;
}

export async function getSessionDetails(sessionId, userId) {
  const session = sessions.get(sessionId);

  if (!session || session.user !== userId) {
    const error = new Error('Session not found');
    error.status = 404;
    throw error;
  }

  return session;
}
