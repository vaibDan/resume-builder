import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";

// Load environment variables from the server/.env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// User routes
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});