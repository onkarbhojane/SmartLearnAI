import express from "express";
import { chat,getChatHistory,clearChat, summaryDocument } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post('/:documentId',authMiddleware,chat);
router.get('/:documentId/history', authMiddleware, getChatHistory);
router.delete('/:documentId/clear', authMiddleware, clearChat);
router.get('/:documentId/:pageNo', authMiddleware, summaryDocument);
export default router;
