import express from "express";
import { chat,getChatHistory,clearChat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post('/:documentId',authMiddleware,chat);
router.get('/:documentId/history', authMiddleware, getChatHistory);
router.delete('/:documentId/clear', authMiddleware, clearChat);
export default router;
