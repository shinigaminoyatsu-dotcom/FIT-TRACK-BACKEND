const User = require('../models/User');
const { generateToken } = require('../services/jwtService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const userPayload = (u) => ({ id: u._id, name: u.name, email: u.email });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    throw new AppError('Please provide name, email and password', 400);
  }
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, token: generateToken(user._id), user: userPayload(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }
  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }
  res.status(200).json({ success: true, token: generateToken(user._id), user: userPayload(user) });
});

// GET /api/auth/profile
exports.getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: userPayload(req.user) });
});

// PUT /api/auth/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body || {};
  if (name === undefined && email === undefined) {
    throw new AppError('Provide name and/or email to update', 400);
  }
  const user = await User.findById(req.user._id);
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  await user.save();
  res.status(200).json({ success: true, user: userPayload(user) });
});

// PUT /api/auth/change-password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide currentPassword and newPassword', 400);
  }
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// POST /api/auth/logout  (JWT is stateless: the client discards the token)
exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully. Please discard the token.' });
});
