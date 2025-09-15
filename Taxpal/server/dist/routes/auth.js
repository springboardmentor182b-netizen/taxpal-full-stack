"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, country, income_bracket } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const user = new User_1.default({
            name,
            email,
            password: hashedPassword,
            country: country || 'US',
            income_bracket: income_bracket || 'middle'
        });
        await user.save();
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error });
    }
});
// Get current user
router.get('/me', auth_1.authenticateToken, async (req, res) => {
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
exports.default = router;
//# sourceMappingURL=auth.js.map