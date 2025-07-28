import { Router } from "express";
import passport from "passport";

const router = Router();

// Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
  })
);

// Google OAuth callback
 router.get(
   "/google/callback",
   passport.authenticate("google", {
     failureRedirect: "http://localhost:5173", // Redirect to frontend on failure
   }),
   (req, res) => {
     // Successful authentication, redirect to frontend
     // Try to get the frontend URL from environment or use default
     console.log("User authenticated:", req.user);
     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
     res.redirect(`${frontendUrl}/dashboard`);
   }
 );

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Check auth status
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: req.user,
    });
  } else {
    res.json({
      authenticated: false,
    });
  }
});

export default router;
