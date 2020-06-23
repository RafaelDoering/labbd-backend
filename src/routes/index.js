const { Router } = require('express');

const authRouter = require('./auth');
const reportsRouter = require('./reports');

const router = Router();

router.use('/auth', authRouter);

router.use('/reports', reportsRouter);

module.exports = router;
