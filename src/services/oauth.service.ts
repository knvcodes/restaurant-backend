// packages/backend/src/routes/auth.routes.ts
import { Router } from "express";
import axios from "axios";
import Users from "modules/users/users.model";
import { generateJWT } from "./jwt.service";

const router = Router();

// Step 1: Redirect user to Google
router.get("/google", (req, res) => {
  const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "profile email",
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`${googleAuthUrl}?${params.toString()}`);
});

// Step 2: Handle callback from Google
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
        grant_type: "authorization_code",
      },
    );

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    const { id, email, name, picture } = userResponse.data;

    // Find or create user
    let user = await Users.findOne({ $or: [{ googleId: id }, { email }] });

    if (!user) {
      user = await Users.create({
        name,
        email,
        googleId: id,
        avatar: picture,
        role: "customer",
        isOAuth: true,
      });
    } else if (!user.googleId) {
      user.googleId = id;
      user.avatar = picture || user.avatar;
      await user.save();
    }

    // Generate your own JWT
    const token = generateJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("OAuth error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
  }
});

export default router;
