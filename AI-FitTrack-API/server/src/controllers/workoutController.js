const Workout = require('../models/Workout');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const FIELDS = ['workoutName', 'category', 'duration', 'caloriesBurned', 'workoutDate'];
const pick = (body = {}) =>
  FIELDS.reduce((acc, k) => (body[k] !== undefined ? { ...acc, [k]: body[k] } : acc), {});
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// POST /api/workouts
exports.addWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.create({ ...pick(req.body), user: req.user._id });
  res.status(201).json({ success: true, data: workout });
});

// GET /api/workouts
exports.getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user._id }).sort({ workoutDate: -1, createdAt: -1 });
  res.status(200).json({ success: true, count: workouts.length, data: workouts });
});

// GET /api/workouts/search?name=&category=&date=YYYY-MM-DD
exports.searchWorkouts = asyncHandler(async (req, res) => {
  const { name, category, date } = req.query;
  const filter = { user: req.user._id };

  if (name) filter.workoutName = { $regex: escapeRegex(name), $options: 'i' };
  if (category) filter.category = { $regex: `^${escapeRegex(category)}$`, $options: 'i' };
  if (date) {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new AppError('Invalid date. Use format YYYY-MM-DD', 400);
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    filter.workoutDate = { $gte: start, $lt: end };
  }

  const workouts = await Workout.find(filter).sort({ workoutDate: -1 });
  res.status(200).json({ success: true, count: workouts.length, data: workouts });
});

// GET /api/workouts/:id
exports.getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new AppError('Workout not found', 404);
  res.status(200).json({ success: true, data: workout });
});

// PUT /api/workouts/:id
exports.updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    pick(req.body),
    { new: true, runValidators: true }
  );
  if (!workout) throw new AppError('Workout not found', 404);
  res.status(200).json({ success: true, data: workout });
});

// DELETE /api/workouts/:id
exports.deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!workout) throw new AppError('Workout not found', 404);
  res.status(200).json({ success: true, message: 'Workout removed successfully' });
});
