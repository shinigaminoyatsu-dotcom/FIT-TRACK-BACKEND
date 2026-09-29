const https = require('https');
const AppError = require('../utils/AppError');

const callGemini = (prompt) =>
  new Promise((resolve, reject) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.startsWith('your_') || apiKey.startsWith('PASTE_')) {
      return reject(new AppError('Gemini API key is not configured on the server', 503));
    }
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'x-goog-api-key': apiKey,
        },
        timeout: 60000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json;
          try {
            json = JSON.parse(raw);
          } catch (e) {
            return reject(new AppError('Invalid response from AI service', 502));
          }
          if (res.statusCode >= 400) {
            const msg = (json.error && json.error.message) || 'AI service error';
            return reject(new AppError(`AI service error: ${msg}`, 502));
          }
          const parts =
            json.candidates && json.candidates[0] && json.candidates[0].content
              ? json.candidates[0].content.parts
              : null;
          const text = parts ? parts.map((p) => p.text || '').join('').trim() : '';
          if (!text) return reject(new AppError('AI service returned an empty response', 502));
          resolve(text);
        });
      }
    );
    req.on('timeout', () => req.destroy(new AppError('AI service timed out', 504)));
    req.on('error', (err) =>
      reject(err instanceof AppError ? err : new AppError(`AI service unreachable: ${err.message}`, 502))
    );
    req.write(body);
    req.end();
  });

const getWorkoutRecommendation = ({ age, fitnessGoal, experience }) =>
  callGemini(
    `You are a certified fitness coach. Create a personalized workout recommendation for a ${age}-year-old ` +
      `with the fitness goal "${fitnessGoal}" and "${experience}" experience level. ` +
      `Include: a weekly workout plan, suggested exercises (sets/reps or duration), ` +
      `Beginner/Intermediate/Advanced-appropriate progression, short motivational guidance, and safety tips. ` +
      `Write in plain text without markdown symbols, and keep it under 250 words.`
  );

const getFitnessInsights = ({ totalWorkouts, averageDuration, totalCaloriesBurned }) =>
  callGemini(
    `You are a fitness analyst. A user has completed ${totalWorkouts} workouts, averaging ` +
      `${averageDuration} minutes each, burning ${totalCaloriesBurned} calories in total. ` +
      `Give a short performance analysis, improvement suggestions, motivational advice and a one-line ` +
      `progress summary. Write in plain text without markdown symbols, under 100 words.`
  );

module.exports = { getWorkoutRecommendation, getFitnessInsights };
