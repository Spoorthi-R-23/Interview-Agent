export function updateScores(currentScore, currentMax, scoreDelta) {
  const newScore = Math.max(0, currentScore + scoreDelta);
  // For MCQ, maxScore is fixed, so do not increment here
  return { score: newScore };
}

export function computeFinalSummary({ score, maxScore, conversation }) {
  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100);
  
  // Extract feedback from system messages (feedback entries)
  const feedbackItems = conversation
    .filter((item) => item.sender === 'system' && item.feedback)
    .map((item) => item.feedback);
  
  const highlights = feedbackItems.length > 0 
    ? feedbackItems.map((feedback) => `- ${feedback}`).join('\n')
    : '- No feedback recorded during the session';

  return {
    finalScore: score,
    maxScore,
    percentage,
    highlights
  };
}
