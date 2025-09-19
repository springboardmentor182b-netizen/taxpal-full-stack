const jwt = require('jsonwebtoken');
const User = require('../user/user.model');

class UserService {
    // Register a new user (store password as plain text)
    async register({ name, email, password, country }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const newUser = new User({
            name,
            email,
            password,  // plain text password
            country
        });

        await newUser.save();
        return { message: 'User registered successfully' };
    }

    // Login user without comparing hashed passwords
    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Compare plain text password
        if (password !== user.password) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token };
    }
}

module.exports = UserService;
