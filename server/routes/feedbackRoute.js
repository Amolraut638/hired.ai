import express from "express";
import {
    createFeedback,
    getFeedbackByInterview,
    getFeedbackByUser,
    updateFeedback,
    deleteFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", createFeedback);
router.get("/interview/:interviewId", getFeedbackByInterview);
router.get("/user/:userId", getFeedbackByUser);
router.put("/:id", updateFeedback);
router.delete("/:id", deleteFeedback);

export default router;
