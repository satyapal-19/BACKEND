import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ==================================================
// REGISTER USER ROUTE
// ==================================================
// Handles:
// 1. Multipart form data
// 2. Avatar upload (required)
// 3. Cover image upload (optional)
// ==================================================
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// ==================================================
// LOGIN USER ROUTE
// ==================================================
router.route("/login").post(loginUser);

// ==================================================
// LOGOUT USER ROUTE (PROTECTED)
// ==================================================
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
