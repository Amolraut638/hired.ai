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
import { userAuth } from "../middleware/auth.js"; // Your auth middleware

const problemRouter = express.Router();

// User routes (require authentication)
problemRouter.get("/", userAuth, getAllProblems);
problemRouter.get("/stats", userAuth, getUserStats);
problemRouter.get("/:problemId", userAuth, getProblemById);
problemRouter.patch("/:problemId/toggle", userAuth, toggleProblemStatus);

// Admin routes (add admin middleware if needed)
problemRouter.post("/admin/add", userAuth, addProblem);
problemRouter.post("/admin/bulk-add", userAuth, bulkAddProblems);
problemRouter.put("/admin/:problemId", userAuth, updateProblem);
problemRouter.delete("/admin/:problemId", userAuth, deleteProblem);

export default problemRouter;
