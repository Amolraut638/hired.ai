import mongoose from "mongoose";

// Disable buffering to fail fast if connection is not established
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }
    try {

        mongoose.connection.on("connected", () => { console.log("Database Connected !") })
        mongoose.connection.on("error", (err) => { console.error("Mongoose connection error:", err) })
        
        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'hired-ai'; // Changed to match project

        if (!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set")
        }

        // Standard connection without manual string manipulation if possible
        await mongoose.connect(mongodbURI, {
            dbName: projectName,
        });

    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        // Do not process.exit(1) here for Vercel compatibility
        throw error; 
    }
}

export default connectDB;