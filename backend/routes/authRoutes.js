import express from "express";
import { signup } from "../controllers/authControllers.js";
import { verifyEmail } from "../controllers/authControllers.js";
import { loginUser } from "../controllers/authControllers.js";
import { logoutUser } from "../controllers/authControllers.js";
import { forgotPassword } from "../controllers/authControllers.js";
import { resetPassword } from "../controllers/authControllers.js";
import { checkAuthToken } from "../controllers/authControllers.js";
import { checkRefreshToken } from "../controllers/authControllers.js";
import { emailVerificationLimiter } from "../middleware/emailVerificationLimiter.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", emailVerificationLimiter, verifyEmail);
router.post("/login", loginUser);
router.post("/verify-auth", checkAuthToken);
router.get("/generate-authtoken", checkRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logoutUser);

export default router;
