import express from "express";
import { createInterview, getInterview, submitAnswers, listUserInterviews, deleteInterview } from "../controllers/interviewController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create interview (user must be authenticated)
router.post("/", protect, createInterview);

// List interviews for user
router.get("/", protect, listUserInterviews);

// Get specific interview
router.get("/:id", protect, getInterview);

// Submit answers and evaluate
router.post("/:id/submit", protect, submitAnswers);

// Delete interview
router.delete("/:id", protect, deleteInterview);

export default router;
