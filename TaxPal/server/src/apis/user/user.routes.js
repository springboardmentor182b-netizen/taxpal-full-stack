const express = require('express');
const UserController = require('../user/user.controller');

const router = express.Router();
const userController = new UserController();

router.post('/register', (req, res) => userController.register(req, res));
router.get('/login', (req, res) => userController.login(req, res));

module.exports = router;
