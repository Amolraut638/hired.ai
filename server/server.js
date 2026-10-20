import "dotenv/config";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import { getCacheStats } from "./middlewares/cache.js";
import userRouter from "./routes/userRoute.js";
import problemRouter from "./routes/problemRoute.js";
import interviewRouter from "./routes/interviewRoute.js";
import debugRoutes from "./routes/debugRoute.js";
import chatbotRoute from "./routes/chatbotRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Behind Vercel / Render / any proxy, req.ip is the proxy's IP unless this is set.
// Without it every visitor shares ONE rate-limit bucket.
app.set("trust proxy", 1);

// Connect DB at startup
await connectDB();

// CORS: set CLIENT_URL in .env (comma-separated for several origins). Open if unset (dev).
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true }));
app.use(express.json({ limit: "1mb" }));

// General limiter for ALL routes
app.use(generalLimiter);

// Health check
app.get("/", (req, res) =>
  res.json({
    status: "Server is live",
    uptime: `${Math.floor(process.uptime())} seconds`,
    cache: getCacheStats(),
  })
);

// Per-route limiters now live inside each router (login/register, AI calls, chatbot)
app.use("/api/users", userRouter);
app.use("/api/interviews", interviewRouter);
app.use("/api/chatbot", chatbotRoute);
app.use("/api/problems", problemRouter);
app.use("/debug", debugRoutes);

// 404 + error handler (JSON instead of Express's default HTML page)
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: status < 500 ? err.message : "Internal server error",
  });
});

// Start the server everywhere EXCEPT Vercel (Vercel runs the exported app itself).
// This replaces the old NODE_ENV check, which silently skipped listen() locally
// whenever NODE_ENV=production was in .env.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
}

export default app;