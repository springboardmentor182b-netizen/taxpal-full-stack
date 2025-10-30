import express, { Request, Response } from 'express';
import { authenticateToken, AuthedRequest } from './auth';
import { authService } from './auth.service';
import {
  registerValidator,
  loginValidator,
  forgotValidator,
  resetValidator,
} from '../../utils/validators/authValidators';
import { handleValidation } from '../../utils/validation';
import { sendResetEmail } from '../../utils/mailer';

const router = express.Router();
console.log('[auth routes] loaded');

// --- DEV DEBUG ---
router.get('/__health', (_req, res) => {
  res.json({ ok: true, router: 'auth', prefix: '/api/v1/auth' });
});
// --- /DEV DEBUG ---

// REGISTER
router.post(
  '/register',
  registerValidator,
  handleValidation,
  async (req: Request, res: Response) => {
    try {
      const { token, user } = await authService.register(req.body);
      res.status(201).json({ message: 'User created successfully', token, user });
    } catch (error: any) {
      if (error?.message === 'USER_EXISTS' || error?.code === 11000) {
        return res.status(400).json({ message: 'User already exists' });
      }
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
);

// LOGIN
router.post(
  '/login',
  loginValidator,
  handleValidation,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      if (!result) return res.status(400).json({ message: 'Invalid credentials' });
      res.json({ message: 'Login successful', ...result });
    } catch {
      res.status(500).json({ message: 'Login failed' });
    }
  }
);

// ========= PROFILE: ME =========

// GET /api/v1/auth/me  -> current user's public profile
router.get('/me', authenticateToken, async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const id = String(req.user._id ?? req.user.id ?? req.user.userId);
    const me = await authService.getPublicById(id);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: me });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e?.message || 'Failed to load profile' });
  }
});

// PUT /api/v1/auth/me  -> update name/email/country/income_bracket
router.put('/me', authenticateToken, async (req: AuthedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const id = String(req.user._id ?? req.user.id ?? req.user.userId);
    const { name, email, country, income_bracket } = req.body || {};
    const updated = await authService.updateProfile(id, { name, email, country, income_bracket });
    res.json({ success: true, data: updated });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e?.message || 'Update failed' });
  }
});

// ========= PASSWORD RESET FLOW =========

// FORGOT PASSWORD
router.post(
  '/forgot-password',
  forgotValidator,
  handleValidation,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.issueResetToken(email);

    // Always respond generically
    if (!result) return res.json({ message: 'If that email exists, we sent a reset link.' });

    const { resetToken } = result;
    const resetUrl = `${
      process.env.CLIENT_URL || 'http://localhost:4200'
    }/reset-password?token=${resetToken}`;
    console.log('[reset-url]', resetUrl);

    try {
      await sendResetEmail(email, resetUrl);
    } catch (e) {
      console.warn('[mailer] failed to send email in dev:', (e as any)?.message || e);
    }

    res.json({ message: 'If that email exists, we sent a reset link.' });
  }
);

// RESET PASSWORD
router.post(
  '/reset-password',
  resetValidator,
  handleValidation,
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    if (!result) return res.status(400).json({ message: 'Invalid or expired reset token' });

    res.json({
      message: 'Password updated successfully',
      token: result.token,
      user: result.user,
    });
  }
);

export default router;
