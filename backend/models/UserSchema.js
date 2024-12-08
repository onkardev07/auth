import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: { type: String },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
