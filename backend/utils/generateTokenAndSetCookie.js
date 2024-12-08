import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId, username) => {
  try {
    const accessToken = jwt.sign(
      { userId, username },
      process.env.ACCESS_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days
      sameSite: "strict", // Helps prevent CSRF attacks
    });

    return accessToken;
  } catch (err) {
    console.error("Error generating token:", err);
    throw new Error("Token generation failed");
  }
};
