const UserService = require('../user/user.service');
const userService = new UserService();

class UserController {
    async register(req, res) {
        try {
            const result = await userService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
    try {
        const { email, password } = req.body;  // GET uses query params
        const result = await userService.login({ email, password });
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message+" Hello Bro" });
    }
    }
}

module.exports = UserController;
