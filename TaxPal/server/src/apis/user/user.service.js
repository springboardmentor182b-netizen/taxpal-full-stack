const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../user/user.model');

class UserService {
    async register({ name, email, password, country }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            passwordHash,
            country
        });

        await newUser.save();
        return { message: 'User registered successfully' };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            token,
            user: { id: user._id, name: user.name, email: user.email }
        };
    }
}

module.exports = UserService;
