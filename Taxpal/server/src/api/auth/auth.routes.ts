import express, { Request, Response } from "express";
import { authenticateToken, AuthedRequest } from "./auth";
import { authService } from "./auth.service";
import {
  registerValidator,
  loginValidator,
  forgotValidator,
  resetValidator,
} from "../../utils/validators/authValidators";
import { handleValidation } from "../../utils/validation";
import { sendResetEmail } from "../../utils/mailer";

const router = express.Router();
console.log("[auth routes] loaded");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required: [name, email, password]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", registerValidator, handleValidation, async (req: Request, res: Response) => {
  try {
    const { token, user } = await authService.register(req.body);
    res.status(201).json({ message: "User created successfully", token, user });
  } catch (error: any) {
    if (error?.message === "USER_EXISTS" || error?.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Error creating user", error });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginValidator, handleValidation, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    if (!result) return res.status(400).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", ...result });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get("/me", authenticateToken, async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const id = String(req.user._id ?? req.user.id ?? req.user.userId);
    const me = await authService.getPublicById(id);
    if (!me) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, data: me });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e?.message || "Failed to load profile" });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset email sent (if user exists)
 */
router.post("/forgot-password", forgotValidator, handleValidation, async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.issueResetToken(email);
  if (!result) return res.json({ message: "If that email exists, we sent a reset link." });

  const { resetToken } = result;
  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:4200"}/reset-password?token=${resetToken}`;
  try {
    await sendResetEmail(email, resetUrl);
  } catch (e) {
    console.warn("[mailer] failed to send email in dev:", (e as any)?.message || e);
  }
  res.json({ message: "If that email exists, we sent a reset link." });
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetValidator, handleValidation, async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  if (!result) return res.status(400).json({ message: "Invalid or expired reset token" });

  res.json({
    message: "Password updated successfully",
    token: result.token,
    user: result.user,
  });
});

export default router;
