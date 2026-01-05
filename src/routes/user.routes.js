import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multur.middleware.js";

const router = Router();

// --------------------------------------------------
// REGISTER USER ROUTE
// --------------------------------------------------
// Handles:
// 1. Multipart form data
// 2. Avatar upload (required)
// 3. Cover image upload (optional)
// 4. User registration logic
// --------------------------------------------------
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",     // frontend key for avatar
      maxCount: 1,        // only one avatar allowed
    },
    {
      name: "coverImage", // frontend key for cover image
      maxCount: 1,        // only one cover image allowed
    },
  ]),
  registerUser // ✅ CONTROLLER MUST BE LAST
);

export default router;
