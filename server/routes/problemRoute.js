import express from "express";
import {
  getAllProblems,
  getProblemById,
  toggleProblemStatus,
  getUserStats,
  addProblem,
  bulkAddProblems,
  updateProblem,
  deleteProblem,
} from "../controllers/problemController.js";
import protect from "../middlewares/authMiddleware.js";
import { cacheMiddleware, clearCache, userCacheKey } from "../middlewares/cache.js";

const problemRouter = express.Router();

// Cache problems list for 10 minutes, PER USER (the list includes each user's solved checkboxes)
problemRouter.get("/", protect, cacheMiddleware(600), getAllProblems);
problemRouter.get("/stats", protect, getUserStats);
problemRouter.get("/:problemId", protect, getProblemById);

// Clear this user's cached list when they toggle a problem
problemRouter.patch(
  "/:problemId/toggle",
  protect,
  (req, res, next) => {
    clearCache(userCacheKey(req.userId, "/api/problems"));
    next();
  },
  toggleProblemStatus
);

// Admin routes (NOTE: any logged-in user can call these; add a role check before real use)
problemRouter.post("/admin/add", protect, addProblem);
problemRouter.post("/admin/bulk-add", protect, bulkAddProblems);
problemRouter.put("/admin/:problemId", protect, updateProblem);
problemRouter.delete("/admin/:problemId", protect, deleteProblem);

export default problemRouter;