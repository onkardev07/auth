import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import dbConnect from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import session from "express-session";
import "./passportConfig.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.session());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.use("/api/auth", authRoutes);
app.use("/", oauthRoutes);

app.listen(port, () => {
  dbConnect();
  console.log(`Server running on port ${port}`);
});
