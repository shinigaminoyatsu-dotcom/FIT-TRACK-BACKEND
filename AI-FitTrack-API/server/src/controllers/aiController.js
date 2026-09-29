const { getWorkoutRecommendation, getFitnessInsights } = require('../services/geminiService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const isNonNegNumber = (v) => v !== '' && v !== null && !isNaN(Number(v)) && Number(v) >= 0;
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// POST /api/ai/workout-recommendation  { age, fitnessGoal, experience }
exports.workoutRecommendation = asyncHandler(async (req, res) => {
  const { age, fitnessGoal, experience } = req.body || {};
  if (age === undefined || !nonEmpty(fitnessGoal) || !nonEmpty(experience)) {
    throw new AppError('Please provide age, fitnessGoal and experience', 400);
  }
  if (!isNonNegNumber(age) || Number(age) < 1 || Number(age) > 120) {
    throw new AppError('Age must be a number between 1 and 120', 400);
  }
  const recommendation = await getWorkoutRecommendation({
    age: Number(age),
    fitnessGoal: fitnessGoal.trim(),
    experience: experience.trim(),
  });
  res.status(200).json({ recommendation });
});

// POST /api/ai/fitness-insights  { totalWorkouts, averageDuration, totalCaloriesBurned }
exports.fitnessInsights = asyncHandler(async (req, res) => {
  const { totalWorkouts, averageDuration, totalCaloriesBurned } = req.body || {};
  const vals = [totalWorkouts, averageDuration, totalCaloriesBurned];
  if (vals.some((v) => v === undefined)) {
    throw new AppError('Please provide totalWorkouts, averageDuration and totalCaloriesBurned', 400);
  }
  if (!vals.every(isNonNegNumber)) {
    throw new AppError('totalWorkouts, averageDuration and totalCaloriesBurned must be non-negative numbers', 400);
  }
  const insight = await getFitnessInsights({
    totalWorkouts: Number(totalWorkouts),
    averageDuration: Number(averageDuration),
    totalCaloriesBurned: Number(totalCaloriesBurned),
  });
  res.status(200).json({ insight });
});
