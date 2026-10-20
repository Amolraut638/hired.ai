import mongoose from "mongoose";
import Interview from "../models/Interview.js";
import aiService from "../services/aiService.js";
import { getCache, setCache } from "../middlewares/cache.js";

const DIFFICULTIES = ["easy", "medium", "hard"];

// Roughly one question per 3 minutes, between 3 and 15.
// (Before: "30 min" produced 30 questions and "60 min" produced 60, which overflowed the AI output limit.)
const questionCountFor = (duration) => {
  const mins = parseInt(duration, 10);
  if (isNaN(mins)) return 5;
  return Math.min(15, Math.max(3, Math.round(mins / 3)));
};

// Loads an interview only if it belongs to the logged-in user.
// Returns null (and sends the response) when the id is bad or not theirs.
const loadOwnedInterview = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ success: false, message: "Invalid interview id" });
    return null;
  }
  const interview = await Interview.findOne({ _id: id, userId: req.userId });
  if (!interview) {
    res.status(404).json({ success: false, message: "Interview not found" });
    return null;
  }
  return interview;
};

// POST /api/interviews
export const createInterview = async (req, res) => {
  try {
    const { position, questions, generate, duration, companyName, jobDescription } = req.body;

    if (!position || !String(position).trim()) {
      return res.status(400).json({ success: false, message: "Position is required" });
    }

    const difficulty = DIFFICULTIES.includes(String(req.body.difficulty).toLowerCase())
      ? String(req.body.difficulty).toLowerCase()
      : "medium";

    let generatedQuestions = [];
    let generatedByAI = false;

    if (generate) {
      const count = questionCountFor(duration);
      // Only cache generic requests. With a job description the questions are tailored, so skip the cache.
      const cacheKey = jobDescription ? null : `questions__${position}__${difficulty}__${count}`;
      const cached = cacheKey ? getCache(cacheKey) : null;

      if (cached) {
        generatedQuestions = cached;
        generatedByAI = true;
      } else {
        try {
          const result = await aiService.generateQuestions({
            position,
            difficulty,
            count,
            jobDescription,
            duration,
          });
          generatedQuestions = result.questions;
          generatedByAI = true;
          if (cacheKey) setCache(cacheKey, generatedQuestions, 3600);
        } catch (err) {
          // Don't save a junk "Question 1 about X" interview. Tell the user so they can retry.
          console.error("generateQuestions failed:", err.message);
          return res.status(502).json({
            success: false,
            message: "Couldn't generate questions right now. Please try again in a moment.",
          });
        }
      }
    }

    const sourceQuestions = questions && questions.length ? questions : generatedQuestions;
    if (!sourceQuestions.length) {
      return res.status(400).json({ success: false, message: "No questions provided" });
    }

    const interview = await Interview.create({
      userId: req.userId, // never trust a userId from the request body
      position,
      difficulty,
      duration: duration || "30 min",
      companyName,
      jobDescription,
      questions: sourceQuestions.map((q) => ({
        questionText: typeof q === "string" ? q : q.question || q.questionText,
      })),
      generatedByAI,
      status: "scheduled",
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/interviews/:id
export const getInterview = async (req, res) => {
  try {
    const interview = await loadOwnedInterview(req, res);
    if (!interview) return;
    res.json({ success: true, data: interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/interviews/:id/submit
export const submitAnswers = async (req, res) => {
  try {
    const interview = await loadOwnedInterview(req, res);
    if (!interview) return;

    const { answers } = req.body; // [{ index, answer }] or [{ questionText, userAnswer }]

    if (Array.isArray(answers)) {
      answers.forEach((a) => {
        const text = a.answer ?? a.userAnswer;
        if (typeof a.index === "number" && interview.questions[a.index]) {
          interview.questions[a.index].userAnswer = text;
        } else if (a.questionText) {
          const q = interview.questions.find((qq) => qq.questionText === a.questionText);
          if (q) q.userAnswer = text;
        }
      });
    }

    interview.status = "completed";
    await interview.save();

    let evalResults = [];
    try {
      evalResults = await aiService.evaluateAnswers({ questions: interview.questions });

      interview.questions.forEach((q, i) => {
        // Match by index first (reliable), fall back to exact question text
        const match =
          evalResults.find((e) => e.index === i) ||
          evalResults.find((e) => (e.question || "").trim() === q.questionText.trim());

        q.aiFeedback = match?.feedback || "No feedback";
        q.score = match ? match.score : 0;
        if (match?.suggestedAnswer) q.suggestedAnswer = match.suggestedAnswer;
      });

      const avg =
        interview.questions.reduce((s, q) => s + (q.score || 0), 0) /
        (interview.questions.length || 1);
      interview.rating = Math.round((avg / 2) * 10) / 10; // 0-5 scale
      interview.feedback = `Interview completed with an average score of ${avg.toFixed(1)}/10.`;

      await interview.save();
    } catch (evalErr) {
      console.error("AI evaluation failed, answers were saved:", evalErr.message);
    }

    res.json({ success: true, data: interview, aiEvaluation: evalResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/interviews
export const listUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/interviews/:id
export const deleteInterview = async (req, res) => {
  try {
    const interview = await loadOwnedInterview(req, res);
    if (!interview) return;
    await interview.deleteOne();
    res.json({ success: true, message: "Interview deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};