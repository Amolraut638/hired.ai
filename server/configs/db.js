import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {console.log("Database Connected !")})
        
        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if(!mongodbURI) {
            throw new Error("MONGODB_URI environment variable not set")
        }

        if(mongodbURI.endsWith('/')) {  //to remove the forward slash
            mongodbURI = mongodbURI.slice(0, -1)
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)
    } catch (error) {
        console.error("Error connecting the mongoDB:", error)
    }
}

export default connectDB;