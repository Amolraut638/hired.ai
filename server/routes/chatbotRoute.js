import express from "express";
import { chatbotReply } from "../controllers/chatbotController.js";
import { chatLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();
router.post("/", chatLimiter, chatbotReply);
export default router;