import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema for each quiz attempt
const quizAttemptSchema = new Schema({
  score: Number,
  totalQuestions: Number,
  answers: [
    {
      question: String,
      userAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean,
      explanation: String,
    },
  ],
  attemptedAt: { type: Date, default: Date.now },
});

// Schema for chat history with AI for a PDF
const chatSchema = new Schema({
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Schema for a PDF study material with quizzes and chat
const pdfMaterialSchema = new Schema({
  title: { type: String, required: true },
  pdfUrl: { type: String, required: true }, // Cloud URL or local path
  description: String,
  uploadedAt: { type: Date, default: Date.now },

  // User interactions specific to this PDF
  quiz_attempts: [quizAttemptSchema],
  chat_sessions: [chatSchema],
  RAG_id:{type:String}
});

// Main User schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email_id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Array of PDFs with their study material, quizzes, and chats
    study_materials: [pdfMaterialSchema],

    // Overall progress (can be computed or updated based on PDF interactions)
    progress: {
      totalQuizzes: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      strengths: [String],
      weaknesses: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
