import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, username) => {
  return jwt.sign({ username, userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};

export const generateRefreshToken = (userId, username) => {
  return jwt.sign({ username, userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};
