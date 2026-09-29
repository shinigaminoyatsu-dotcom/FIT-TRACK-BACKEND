const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/workouts', require('./workoutRoutes'));
router.use('/ai', require('./aiRoutes'));

module.exports = router;
