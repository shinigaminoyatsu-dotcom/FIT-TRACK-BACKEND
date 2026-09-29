const router = require('express').Router();
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', c.register);
router.post('/login', c.login);
router.get('/profile', protect, c.getProfile);
router.put('/profile', protect, c.updateProfile);
router.put('/change-password', protect, c.changePassword);
router.post('/logout', protect, c.logout);

module.exports = router;
