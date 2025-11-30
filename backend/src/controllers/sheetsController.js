import { appendInterviewSummary } from '../services/sheetsService.js';

export async function publish(req, res, next) {
  try {
    const range = await appendInterviewSummary(req.body);
    res.status(201).json({ range });
  } catch (error) {
    next(error);
  }
}
