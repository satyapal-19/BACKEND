// --------------------------------------------------
// Preload environment variables FIRST
// --------------------------------------------------
import "./env.js";

// --------------------------------------------------
// Import rest of the application
// --------------------------------------------------
import connectDB from "./db/index.js";
import { app } from "./app.js";

// --------------------------------------------------
// Start server after DB connection
// --------------------------------------------------
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
