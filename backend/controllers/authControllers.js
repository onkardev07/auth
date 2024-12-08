import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "../mailtrap/emails.js";
import { sendResetPasswordEmailSuccessEmail } from "../mailtrap/emails.js";
import { generateAccessToken } from "../utils/generateTokens.js";
import { generateRefreshToken } from "../utils/generateTokens.js";
import path from "path";

export const signup = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, msg: "Email Already Registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      verificationToken,
      verificationTokenExpiresAt,
    });

    // generateTokenAndSetCookie(res, user._id, username);
    sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(400).json({ success: false, msg: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Verification Error" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    res.status(200).json({
      success: true,
      msg: "Email verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, msg: `Server Error:${err.message}` });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    const accessToken = generateAccessToken(user._id, user.username);
    const refreshToken = generateRefreshToken(user._id, user.username);

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 4 * 60 * 1000,
    });

    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        accessToken: accessToken,
        password: undefined,
      },
    });
  } catch (err) {
    console.log("Error in login ", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const checkRefreshToken = async (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  console.log(refreshToken);

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
  }

  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            const updatedUser = await User.findOneAndUpdate(
              { email: user.email },
              { refreshToken: null },
              { new: true, runValidators: true }
            );

            res.clearCookie("refresh-token");
            return res
              .status(403)
              .json({ msg: "Refresh token expired, please log in again" });
          } else {
            return res.status(401).send("Invalid refresh token");
          }
        }

        // Ensure that no response has been sent before continuing
        if (!res.headersSent) {
          const accessToken = generateAccessToken(
            decoded._id,
            decoded.username
          );
          res.status(200).json({
            success: true,
            accessToken,
          });
        }
      }
    );
  } catch (err) {
    console.log("Error in refresh token ", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Failed to refresh token" });
    }
  }
};

export const checkAuthToken = (req, res) => {
  const { authToken } = req.body;
  if (!authToken) {
    return res.status(403).json({ msg: "auth token not found" });
  }
  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        return res.status(403).json({ msg: "auth token expired " });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ msg: "Invalid token" });
      }
      return res.status(500).json({ msg: "Failed to authenticate token" });
    }
    res.status(200).json({ valid: true, decoded });
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;

    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `http://localhost:5173/reset-password/${resetPasswordToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();
    await sendResetPasswordEmailSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("refresh-token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
