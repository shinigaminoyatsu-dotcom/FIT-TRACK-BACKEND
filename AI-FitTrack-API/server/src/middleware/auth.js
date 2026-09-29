const User = require('../models/User');
const { verifyToken } = require('../services/jwtService');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

/**
 * Authentication middleware:
 *  1. Read Authorization header
 *  2. Extract JWT token
 *  3. Verify JWT signature (and expiry)
 *  4. Decode user information
 *  5. Attach user information to request
 *  6. Reject unauthorized requests (401)
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1. Read Authorization header
  const header = req.headers.authorization;
  if (!header) {
    throw new AppError('Not authorized, no token provided', 401);
  }
  if (!/^Bearer\s+\S+$/i.test(header.trim())) {
    throw new AppError('Invalid Authorization header format. Use: Bearer <token>', 401);
  }

  // 2. Extract JWT token
  const token = header.trim().split(/\s+/)[1];

  // 3 + 4. Verify signature and decode payload
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Not authorized, token expired', 401);
    }
    throw new AppError('Not authorized, token invalid', 401);
  }

  // 5. Attach user information to the request
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('Not authorized, user no longer exists', 401);
  }
  req.user = user;
  req.token = token;
  next();
});

module.exports = { protect };
