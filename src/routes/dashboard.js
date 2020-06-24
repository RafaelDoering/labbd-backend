const { Router } = require('express');

const DashboardController = require('../controllers/dashboard');

const router = Router();

router.get('/cases', DashboardController.dashboard);

module.exports = router;
