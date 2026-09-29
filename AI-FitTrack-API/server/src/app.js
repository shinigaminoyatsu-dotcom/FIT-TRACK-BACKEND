const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { protect } = require('./middleware/auth');
const { searchWorkouts } = require('./controllers/workoutController');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ success: true, message: 'AI FitTrack API is running' }));

app.use('/api', routes);

// Convenience alias seen in the PDF's request history: GET /search?name=&category=&date=
app.get('/search', protect, searchWorkouts);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
