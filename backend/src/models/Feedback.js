import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession', required: true },
    category: { type: String, enum: ['communication', 'technical', 'behavioral', 'overall'], required: true },
    comments: { type: String, required: true },
    score: { type: Number, min: 0, max: 10, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
