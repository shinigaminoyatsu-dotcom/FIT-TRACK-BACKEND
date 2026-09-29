const router = require('express').Router();
const c = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

router.use(protect); // every workout route is protected

router.route('/').post(c.addWorkout).get(c.getWorkouts);
router.get('/search', c.searchWorkouts); // must be declared before '/:id'
router.route('/:id').get(c.getWorkoutById).put(c.updateWorkout).delete(c.deleteWorkout);

module.exports = router;
