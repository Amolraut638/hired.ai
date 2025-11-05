import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoute.js";
import problemRouter from "./routes/problemRoute.js";

const app = express();  //created express app 
const PORT = process.env.PORT || 3000;  // set the PORT number

await connectDB()

//middleware 
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => res.send('Server is live...')) //when we hit the home route ('/') then this funtion will executed
app.use('/api/users', userRouter)
app.use("/api/problems", problemRouter);



//start the backend server
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
