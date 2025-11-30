import {
  startInterviewSession,
  processCandidateMessage,
  endInterviewSession,
  recordFeedback,
  listSessionsByUser,
  getSessionDetails,
} from "../services/interviewService.js";
import { transcribeAudio } from "../services/whisperService.js";

export async function startSession(req, res, next) {
  try {
    const mode = req.body.mode || "technical";
    if (!["hr", "technical", "mcq"].includes(mode)) {
      const err = new Error(
        "Invalid interview mode. Must be one of: hr, technical, mcq"
      );
      err.status = 400;
      throw err;
    }
    const result = await startInterviewSession({ userId: req.user.id, mode });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function respond(req, res, next) {
  try {
    const result = await processCandidateMessage({
      sessionId: req.body.sessionId,
      message: req.body.message,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function respondWithAudio(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error("Audio file is required");
      err.status = 400;
      throw err;
    }
    const transcript = await transcribeAudio(req.file.path);
    const result = await processCandidateMessage({
      sessionId: req.body.sessionId,
      message: transcript,
    });
    res.status(200).json({ transcript, ...result });
  } catch (error) {
    next(error);
  }
}

export async function completeSession(req, res, next) {
  try {
    const summary = await endInterviewSession(req.body.sessionId);
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
}

export async function submitFeedback(req, res, next) {
  try {
    const feedback = await recordFeedback({
      sessionId: req.body.sessionId,
      feedback: req.body.feedback,
    });
    res.status(201).json({ feedback });
  } catch (error) {
    next(error);
  }
}

export async function getSessions(req, res, next) {
  try {
    const sessions = await listSessionsByUser(req.user.id);
    res.status(200).json({ sessions });
  } catch (error) {
    next(error);
  }
}

export async function getSession(req, res, next) {
  try {
    const session = await getSessionDetails(req.params.sessionId, req.user.id);
    res.status(200).json({ session });
  } catch (error) {
    next(error);
  }
}
