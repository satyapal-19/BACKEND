// --------------------------------------------------
// Import required libraries
// --------------------------------------------------

// Mongoose is an ODM used to interact with MongoDB
import mongoose, { Schema } from "mongoose";

// bcrypt is used for hashing and comparing passwords securely
import bcrypt from "bcrypt";

// jsonwebtoken is used for generating access and refresh tokens
import jwt from "jsonwebtoken";

// --------------------------------------------------
// User Schema Definition
// --------------------------------------------------
// This schema defines how user documents are stored
// in the MongoDB "users" collection

const userSchema = new Schema(
  {
    // ---------------- USERNAME ----------------
    username: {
      type: String,          // Data type
      required: true,        // Must be provided
      unique: true,          // Must be unique across users
      lowercase: true,       // Stored in lowercase
      trim: true,            // Removes extra spaces
      index: true,           // Improves query performance
    },

    // ---------------- EMAIL ----------------
    email: {
      type: String,
      required: true,        // Email is mandatory
      unique: true,          // Only one account per email
      lowercase: true,       // Case-insensitive storage
      trim: true,
    },

    // ---------------- FULL NAME ----------------
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ---------------- PROFILE IMAGE ----------------
    avatar: {
      type: String,          // Stores image URL (Cloudinary, S3, etc.)
      required: true,
    },

    // ---------------- COVER IMAGE ----------------
    coverImage: {
      type: String,          // Optional banner image URL
    },

    // ---------------- WATCH HISTORY ----------------
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",        // Reference to Video collection
      },
    ],

    // ---------------- PASSWORD ----------------
    password: {
      type: String,
      required: [true, "Password is required"],
      // Password is stored as a HASH, not plain text
    },

    // ---------------- REFRESH TOKEN ----------------
    refreshToken: {
      type: String,          // Stores the latest refresh token
    },
  },

  // Automatically adds createdAt and updatedAt fields
  { timestamps: true }
);

// --------------------------------------------------
// PRE-SAVE MIDDLEWARE (PASSWORD HASHING)
// --------------------------------------------------
// This runs automatically before saving a user
// Uses async style (NO next())

userSchema.pre("save", async function () {

  // If password is not modified, skip hashing
  // This is important during profile updates
  if (!this.isModified("password")) return;

  // Hash the password using bcrypt
  // 10 is the salt rounds (security vs performance balance)
  this.password = await bcrypt.hash(this.password, 10);
});

// --------------------------------------------------
// PASSWORD COMPARISON METHOD
// --------------------------------------------------
// Used during login to compare entered password
// with hashed password stored in database

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// --------------------------------------------------
// ACCESS TOKEN GENERATOR
// --------------------------------------------------
// Short-lived token used for authentication
// Example expiry: 10–15 minutes

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// --------------------------------------------------
// REFRESH TOKEN GENERATOR
// --------------------------------------------------
// Long-lived token used to generate new access tokens
// Example expiry: 7–30 days

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// --------------------------------------------------
// Export User Model
// --------------------------------------------------
// Creates "users" collection in MongoDB

export const User = mongoose.model("User", userSchema);
