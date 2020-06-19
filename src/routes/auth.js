const { Router } = require('express');

const AuthController = require('../controllers/auth');

const router = Router();

router.get('/signup', AuthController.signup);

module.exports = router;
