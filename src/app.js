// Import required packages
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create Express application instance
const app = express();

/**
 * -----------------------------
 * Global Middlewares
 * -----------------------------
 */

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // frontend URL
    credentials: true, // allow cookies
  })
);

// Parse incoming JSON requests (limit 16kb)
app.use(express.json({ limit: "16kb" }));

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from "public" folder
app.use(express.static("public"));

// Parse cookies from incoming requests
app.use(cookieParser());

/**
 * -----------------------------
 * Routes
 * -----------------------------
 */

// Import user routes
import userRouter from "./routes/user.routes.js";

// Use user routes
app.use("/api/v1/users", userRouter);
// Example endpoint:
// http://localhost:8000/api/v1/users/register

// Export app for use in server/index file
export { app };
