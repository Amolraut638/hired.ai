import express from "express";
import {
  createInterview,
  getInterview,
  submitAnswers,
  listUserInterviews,
  deleteInterview,
} from "../controllers/interviewController.js";
import protect from "../middlewares/authMiddleware.js";
import { aiLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// AI limiter only where Gemini is actually called (create + submit), and only for logged-in users
router.post("/", protect, aiLimiter, createInterview);
router.get("/", protect, listUserInterviews);
router.get("/:id", protect, getInterview);
router.post("/:id/submit", protect, aiLimiter, submitAnswers);
router.delete("/:id", protect, deleteInterview);

export default router;