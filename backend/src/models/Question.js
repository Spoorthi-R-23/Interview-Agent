import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    mode: { type: String, enum: ['hr', 'technical', 'behavioral'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    tags: [{ type: String }],
    metadata: { type: Map, of: String }
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
