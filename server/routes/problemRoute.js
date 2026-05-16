// routes/problemRoute.js
import express from "express";
import {
  getAllProblems,
  getProblemById,
  toggleProblemStatus,
  getUserStats,
  addProblem,
  bulkAddProblems,
  updateProblem,
  deleteProblem
} from "../controllers/problemController.js";
import protect from "../middlewares/authMiddleware.js"; // Auth middleware

const problemRouter = express.Router();

// User routes (require authentication)
problemRouter.get("/", protect, getAllProblems);
problemRouter.get("/stats", protect, getUserStats);
problemRouter.get("/:problemId", protect, getProblemById);
problemRouter.patch("/:problemId/toggle", protect, toggleProblemStatus);

// Admin routes (add admin middleware if needed)
problemRouter.post("/admin/add", protect, addProblem);
problemRouter.post("/admin/bulk-add", protect, bulkAddProblems);
problemRouter.put("/admin/:problemId", protect, updateProblem);
problemRouter.delete("/admin/:problemId", protect, deleteProblem);

export default problemRouter;
