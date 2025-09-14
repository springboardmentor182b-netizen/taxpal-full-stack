import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, country, income_bracket } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      country: country || 'US',
      income_bracket: income_bracket || 'middle'
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        income_bracket: user.income_bracket
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        income_bracket: user.income_bracket
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req: any, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      country: req.user.country,
      income_bracket: req.user.income_bracket
    }
  });
});

export default router;
