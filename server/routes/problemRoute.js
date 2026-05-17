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
import protect from "../middlewares/authMiddleware.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js"; // ✅

const problemRouter = express.Router();

// Cache problems list for 10 minutes
problemRouter.get("/", protect, cacheMiddleware(600), getAllProblems);
problemRouter.get("/stats", protect, getUserStats);
problemRouter.get("/:problemId", protect, getProblemById);

// Clear cache when problem status is toggled
problemRouter.patch("/:problemId/toggle", protect, (req, res, next) => {
    clearCache(`__cache__/api/problems`);
    next();
}, toggleProblemStatus);

// Admin routes
problemRouter.post("/admin/add", protect, addProblem);
problemRouter.post("/admin/bulk-add", protect, bulkAddProblems);
problemRouter.put("/admin/:problemId", protect, updateProblem);
problemRouter.delete("/admin/:problemId", protect, deleteProblem);

export default problemRouter;