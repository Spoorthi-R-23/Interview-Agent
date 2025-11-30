import axios from "axios";

import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export const INTERVIEW_AGENT_SYSTEM_PROMPT = `You are an AI interview coach conducting structured mock interviews. You support three modes: HR round, Technical round, and MCQ (Multiple Choice Questions) round. Always behave like a professional interviewer.

Guidelines:
1. CRITICAL: Never repeat the same question twice. Always ask completely different questions based on the conversation history.
2. Adapt follow-up questions based on the candidate response history. Escalate or de-escalate difficulty dynamically.
3. Keep questions concise and specific; focus on one topic at a time.
4. Provide real-time feedback that covers strengths, improvement areas, and a numeric score delta between -5 and +5.
5. Maintain running context (skills demonstrated, weaknesses, confidence level).

For MCQ mode:
- Generate multiple choice questions with 4 options (A, B, C, D)
- Include the correct answer in your response
- Provide detailed explanation in feedback after user selects an answer

6. After each candidate response, respond with ONLY a valid JSON object (no markdown, no code blocks) containing:
   
   For text-based modes (HR, Technical):
   {
     "question": "next question string - MUST BE DIFFERENT from previous questions",
     "question_category": "hr|technical",
     "difficulty": "easy|medium|hard",
     "feedback": "detailed coaching feedback on the candidate's last response",
     "score_delta": number between -5 and 5,
     "overall_summary": "optional evolving summary"
   }
   
   For MCQ mode:
   {
     "question": "the MCQ question text",
     "question_category": "mcq",
     "difficulty": "easy|medium|hard",
     "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
     "correct_answer": "A|B|C|D",
     "feedback": "detailed explanation after user answers",
     "score_delta": number between -5 and 5,
     "overall_summary": "optional evolving summary"
   }`;

export async function runInterviewAgent({
  mode,
  difficulty,
  conversation,
  userMessage,
}) {
  // Validate API key
  if (!env.geminiApiKey || !env.geminiApiKey.startsWith("AIza")) {
    throw new Error(
      "Invalid or missing GEMINI_API_KEY. Please configure a valid Google AI API key in .env file."
    );
  }

  // Build the system instruction with conversation context
  const systemInstruction = `${INTERVIEW_AGENT_SYSTEM_PROMPT}

Interview Mode: ${mode.toUpperCase()}
Current Difficulty: ${difficulty}
Conversation Turns: ${conversation.length}

Previous questions asked (DO NOT repeat these):
${conversation
  .filter((msg) => msg.sender === "interviewer")
  .map((msg, idx) => `${idx + 1}. ${msg.content}`)
  .join("\n")}

Current candidate message: ${
    userMessage || "Starting the interview - provide the first question"
  }

IMPORTANT: You MUST respond with ONLY valid JSON. No markdown formatting, no code blocks, no extra text. Just pure JSON starting with { and ending with }.`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${env.geminiApiKey}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: systemInstruction,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from Gemini API");
    }

    let content = response.data.candidates[0].content.parts[0].text;

    // Clean up markdown code blocks if present
    content = content.trim();
    if (content.startsWith("```json")) {
      content = content.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (content.startsWith("```")) {
      content = content.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON response
    const parsed = JSON.parse(content);

    // Validate required fields
    if (!parsed.question || !parsed.feedback) {
      throw new Error("Missing required fields in AI response");
    }

    logger.info("Gemini API call successful", {
      mode,
      difficulty,
      questionLength: parsed.question.length,
    });

    return {
      question: parsed.question,
      questionCategory: parsed.question_category || mode,
      difficulty: parsed.difficulty || difficulty,
      feedback: parsed.feedback,
      scoreDelta: Number(parsed.score_delta) || 0,
      overallSummary: parsed.overall_summary || "",
      // MCQ specific fields
      options: parsed.options || null,
      correctAnswer: parsed.correct_answer || null,
    };
  } catch (error) {
    logger.error("Gemini API call failed", {
      error: error.message,
      apiKey: env.geminiApiKey
        ? `${env.geminiApiKey.substring(0, 10)}...`
        : "missing",
      response: error.response?.data || "no response data",
    });

    // Re-throw the error instead of returning fallback
    throw new Error(
      `AI service unavailable: ${error.message}. Please check your GEMINI_API_KEY configuration.`
    );
  }
}
