import express from 'express';
import { 
  getUserDocuments,
  getDocumentChats,
  addChatMessage,
  deleteDocumentChats
} from '../controllers/study.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Fetch all documents of a user
router.get('/documents/:documentId',authMiddleware, getUserDocuments);

// Fetch chat for a document
router.get('/chats/:userId/:documentId', getDocumentChats);

// Add new chat message
router.post('/chats/:userId/:documentId', addChatMessage);

// Delete chat
router.delete('/chats/:userId/:documentId', deleteDocumentChats);

export default router;
