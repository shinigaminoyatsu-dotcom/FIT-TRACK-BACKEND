require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it to your .env file.');
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith('PASTE_') || process.env.GEMINI_API_KEY.startsWith('your_')) {
  console.warn('WARNING: GEMINI_API_KEY is not set - /api/ai/* endpoints will return 503 until you add it to .env');
}

connectDB().then(() => {
  app.listen(PORT, () => console.log(`AI FitTrack API running on port ${PORT}`));
});
