import express from "express";
import passport from "passport";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;
    console.log("Profilepic:", user);
    res.send(`
      <script>
        window.opener.postMessage({
          user: ${JSON.stringify(user)},
          profilePicture: "${user.profilePicture}"
        }, "*");
        window.close();
      </script>
    `);
  }
);

router.get("/auth/google/success", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    user: req.user,
  });
});

router.get("/check-session", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ sessionActive: true });
  }
  return res.status(401).json({ sessionActive: false });
});

router.get("/check-oauth-session", (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated
    res.json({ user: req.user });
  } else {
    // User is not authenticated
    res.status(401).json({ error: "Not authenticated" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
});

export default router;
