// Load environment variables FIRST before any other imports
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB();

app.use(cors({
  origin: ["http://localhost", "http://localhost:80", "http://localhost:3000", "http://127.0.0.1", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// User routes
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);

// Error handling middleware for express-joi-validation
app.use((err, req, res, next) => {
  console.log('[Error Handler] Error caught:', err);
  console.log('[Error Handler] Is Joi error?', err && err.error && err.error.isJoi);

  // Check if it's a Joi validation error
  if (err && err.error && err.error.isJoi) {
    console.log('[Error Handler] Joi validation failed:', err.error.details);
    // Format the validation error for user-friendly response
    const errorDetails = err.error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      message: 'Validation error',
      errors: errorDetails
    });
  }

  // Pass to next error handler if not a Joi error
  console.log('[Error Handler] Not a Joi error, passing to next handler');
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});