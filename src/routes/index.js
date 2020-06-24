const { Router } = require('express');

const authRouter = require('./auth');
const reportsRouter = require('./reports');
const dashboardRouter = require('./dashboard');

const router = Router();

router.use('/auth', authRouter);

router.use('/reports', reportsRouter);

router.use('/dashboard', dashboardRouter);

module.exports = router;
