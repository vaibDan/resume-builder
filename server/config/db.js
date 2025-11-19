import mongoose from "mongoose";


const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        let MongoDB_URI = process.env.MONGO_DB_URI;
        const projetName = "resume-builder-cluster";

        console.log("MONGO_DB_URI:", MongoDB_URI ? "Present" : "Missing");
        console.log("Full URI:", MongoDB_URI ? `${MongoDB_URI}/${projetName}` : "N/A");

        if (!MongoDB_URI) {
            throw new Error("MongoDB connection string is not defined in environment variables");
        }

        if (MongoDB_URI.endsWith('/')) {
            MongoDB_URI = MongoDB_URI.slice(0, -1);
        }

        await mongoose.connect(`${MongoDB_URI}/${projetName}`);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;