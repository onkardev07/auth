import { rateLimit } from "express-rate-limit";

export const emailVerificationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  message: {
    success: false,
    msg: "Too many attempts. Please try again after 1 minute.",
  },
  headers: true,
});
