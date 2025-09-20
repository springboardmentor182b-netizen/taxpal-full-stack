import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { authenticateToken, AuthedRequest } from '../middleware/auth';
import {
  registerValidator, loginValidator, forgotValidator, resetValidator
} from '../validators/authValidators';
import { handleValidation } from '../utils/validation';
import { sendResetEmail } from '../utils/mailer';

const router = express.Router();
console.log('[auth routes] loaded');  // ✅ proves this file is actually used

const sign = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

// --- DEV DEBUG ---
router.get('/__health', (_req, res) => {
  res.json({ ok: true, router: 'auth', prefix: '/api/v1/auth' });
});
// --- /DEV DEBUG ---

// REGISTER
router.post('/register', registerValidator, handleValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, password, country, income_bracket } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hashed,
      country: country || 'US',
      income_bracket: income_bracket || 'middle'
    });

    const token = sign(user._id.toString());
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, country: user.country, income_bracket: user.income_bracket }
    });
  } catch (error: any) {
    if (error?.code === 11000) return res.status(400).json({ message: 'User already exists' });
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// LOGIN
router.post('/login', loginValidator, handleValidation, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = sign(user._id.toString());
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, country: user.country, income_bracket: user.income_bracket }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// ME
router.get('/me', authenticateToken, async (req: AuthedRequest, res: Response) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email, country: req.user.country, income_bracket: req.user.income_bracket }
  });
});

// FORGOT PASSWORD
router.post('/forgot-password', forgotValidator, handleValidation, async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // Always return generic message
  if (!user) return res.json({ message: 'If that email exists, we sent a reset link.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:4200'}/reset-password?token=${token}`;
  console.log('[reset-url]', resetUrl); // helpful during dev
  // ✅ Don’t crash if mailer isn’t configured in dev
  try {
    await sendResetEmail(user.email, resetUrl);
  } catch (e) {
    console.warn('[mailer] failed to send email in dev:', (e as any)?.message || e);
  }

  res.json({ message: 'If that email exists, we sent a reset link.' });
});

// RESET PASSWORD
router.post('/reset-password', resetValidator, handleValidation, async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

  user.password = await bcrypt.hash(password, 12);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const jwtToken = sign(user._id.toString());
  res.json({
    message: 'Password updated successfully',
    token: jwtToken,
    user: { id: user._id, name: user.name, email: user.email, country: user.country, income_bracket: user.income_bracket }
  });
});

export default router;
