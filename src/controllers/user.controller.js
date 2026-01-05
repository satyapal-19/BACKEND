import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// --------------------------------------------------
// REGISTER USER CONTROLLER
const generatAccessAndRefreshTokens = async(userId)=>{

try {
  const user =  await User.findOne(userId)
   const accessToken = user.generateAccessToken()
  const refreshToken =  user.generateRefreshToken()
} catch (error) {
  throw new ApiError(500,"Something went wrong  while generating refresh and access tokens ")
}

}
// --------------------------------------------------
const registerUser = asyncHandler(async (req, res) => {

  // 1️⃣ Extract required fields from request body
  const { fullName, email, username, password } = req.body;

  // 2️⃣ Validate all mandatory fields
  // Prevents undefined / empty values reaching DB queries
  if ([fullName, email, username, password].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // 3️⃣ Normalize inputs (CRITICAL to avoid duplicate & false matches)
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.toLowerCase().trim();

  // 4️⃣ Check if email already exists (SAFE query)
  const emailExists = await User.findOne({ email: normalizedEmail });
  if (emailExists) {
    throw new ApiError(409, "Email already registered");
  }

  // 5️⃣ Check if username already exists (SAFE query)
  const usernameExists = await User.findOne({ username: normalizedUsername });
  if (usernameExists) {
    throw new ApiError(409, "Username already taken");
  }

  // 6️⃣ Extract uploaded files from multer
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // 7️⃣ Avatar is mandatory
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 8️⃣ Upload avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // 9️⃣ Upload cover image if provided (optional)
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // 🔟 Create new user in database
  const user = await User.create({
    fullName,
    email: normalizedEmail,
    username: normalizedUsername,
    password, // hashed via pre-save middleware
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  });

  // 1️⃣1️⃣ Fetch newly created user without sensitive fields
  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken");

  // 1️⃣2️⃣ Safety check (rare but important)
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // 1️⃣3️⃣ Send success response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
})
const loginUser =asyncHandler (async (req,res)=>{
//   req body -> data 
//   username or email as a  login
//   finding the user 
//  password check
//   access and refresh token 
//  send cookies 

const{email,username,password} = req.body 
if(!username || !email ) {
   throw new ApiError(400,"username or email required to login")
}
const user =await User.findOne({
  $or : [{username},{email}] 
})
if(!user){
  throw new ApiError(404 ,"User does not exist")
}
const isPasswordValid = await user.isPasswordCorrect(password)
})
if(!isPasswordValid) {
  throw new ApiError(401,"Invalid User Credentials")
}
const {accessToken,refreshToken}= await generatAccessAndRefreshTokens(user._id)

const loggedInUser= await User.findById (user._id).select("-password -refreshToken")

export { registerUser };
export {loginUser}