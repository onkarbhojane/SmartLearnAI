// backend/models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, default: 'General' },
  size: { type: String },
  pages: { type: Number },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz_attempts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  chat_sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
