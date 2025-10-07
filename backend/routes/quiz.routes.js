import express from "express";
import { saveQuizAttempt } from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.post("/save", authMiddleware, saveQuizAttempt);
export default router;
