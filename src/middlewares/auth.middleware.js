import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// ==================================================
// VERIFY JWT MIDDLEWARE
// ==================================================
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies OR Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // 2️⃣ If token missing
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 3️⃣ Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // 4️⃣ Find user from decoded token
    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken");

    // 5️⃣ If user not found
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    // 6️⃣ Attach user to request
    req.user = user;

    // 7️⃣ Proceed to next middleware/controller
    next();

  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
});
