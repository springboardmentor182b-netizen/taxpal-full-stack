const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');

class UserService {
    async register({ name, email, password, country }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token };
    }
}

module.exports = UserService;


