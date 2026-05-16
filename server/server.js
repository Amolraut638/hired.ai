import "dotenv/config";
import dns from "dns";
import express from "express";
dns.setDefaultResultOrder("ipv4first");
    
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import problemRouter from "./routes/problemRoute.js";
import interviewRouter from "./routes/interviewRoute.js";
import debugRoutes from './routes/debugRoute.js';
import chatbotRoute from "./routes/chatbotRoute.js";

const app = express();  //created express app 
const PORT = process.env.PORT || 3000;  // set the PORT number

//start the backend server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT} [v1.0.1-gemini-fix]`);
    });
}

await connectDB();  

// Database connection middleware
/* app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: "Database connection failed", details: error.message });
    }
}); */

//middleware 
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Server is live...')) //when we hit the home route ('/') then this funtion will executed
app.use('/api/users', userRouter)
app.use("/api/problems", problemRouter);
app.use("/api/interviews", interviewRouter);
app.use('/debug', debugRoutes);
app.use("/api/chatbot", chatbotRoute);


export default app;
