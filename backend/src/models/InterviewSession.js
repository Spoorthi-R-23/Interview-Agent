import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ['system', 'interviewer', 'candidate'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    scoreDelta: { type: Number, default: 0 },
    feedback: { type: String }
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, enum: ['hr', 'technical', 'behavioral'], required: true },
    status: { type: String, enum: ['scheduled', 'in-progress', 'completed'], default: 'scheduled' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    conversation: [messageSchema],
    feedbackSummary: { type: String },
    startedAt: { type: Date },
    endedAt: { type: Date },
    calendarEventId: { type: String },
    sheetsRowId: { type: String }
  },
  { timestamps: true }
);

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
