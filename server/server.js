import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { generalLimiter, aiLimiter, authLimiter } from "./middlewares/rateLimiter.js";
import userRouter from "./routes/userRoute.js";
import problemRouter from "./routes/problemRoute.js";
import interviewRouter from "./routes/interviewRoute.js";
import debugRoutes from './routes/debugRoute.js';
import chatbotRoute from "./routes/chatbotRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB at startup
await connectDB();

// Core middleware
app.use(express.json());
app.use(cors());

// General rate limiter applied to ALL routes
app.use(generalLimiter);

// Routes
app.get('/', (req, res) => res.send('Server is live...'));

// Auth limiter — prevents brute force on login/register
app.use('/api/users', authLimiter, userRouter);

// AI limiter — Gemini API calls are expensive, limit per hour
app.use("/api/interviews", aiLimiter, interviewRouter);
app.use("/api/chatbot", aiLimiter, chatbotRoute);

// Normal routes — only general limiter applies
app.use("/api/problems", problemRouter);
app.use('/debug', debugRoutes);

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
}

export default app;