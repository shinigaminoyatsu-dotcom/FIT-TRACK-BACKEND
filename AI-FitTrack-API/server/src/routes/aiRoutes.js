const router = require('express').Router();
const c = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/workout-recommendation', c.workoutRecommendation);
router.post('/fitness-insights', c.fitnessInsights);

module.exports = router;
