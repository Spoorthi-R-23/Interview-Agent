import { createInterviewEvent, cancelInterviewEvent } from '../services/calendarService.js';

export async function schedule(req, res, next) {
  try {
    const eventId = await createInterviewEvent(req.body);
    res.status(201).json({ eventId });
  } catch (error) {
    next(error);
  }
}

export async function cancel(req, res, next) {
  try {
    await cancelInterviewEvent(req.params.eventId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
