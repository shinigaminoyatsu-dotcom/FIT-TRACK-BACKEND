# AI FitTrack API

Node.js + Express + MongoDB (Mongoose) REST API with JWT auth and Google Gemini fitness AI.

## Run
1. `cd server && npm install`
2. `.env` is included with a generated `JWT_SECRET` and local `MONGO_URI`. Only paste your `GEMINI_API_KEY` (https://aistudio.google.com/apikey). If your file browser hides dotfiles, `env.txt` is an identical copy - rename it to `.env`
3. Make sure MongoDB is running, then `npm start` (or `npm run dev`)
4. Import `FitTrack.postman_collection.json` into Postman / Thunder Client. Register/Login saves the token automatically.

## Endpoints (all except register/login require `Authorization: Bearer <token>`)
| Method | Path | Notes |
|---|---|---|
| POST | /api/auth/register | `{name,email,password}` -> 201 `{success,token,user}` |
| POST | /api/auth/login | `{email,password}` -> 200 `{success,token,user}` |
| GET / PUT | /api/auth/profile | view / update name, email |
| PUT | /api/auth/change-password | `{currentPassword,newPassword}` |
| POST | /api/auth/logout | stateless acknowledgement |
| POST / GET | /api/workouts | add / list (`count`, `data`) |
| GET | /api/workouts/search?name=&category=&date=YYYY-MM-DD | filters combine (AND) |
| GET / PUT / DELETE | /api/workouts/:id | own workouts only |
| POST | /api/ai/workout-recommendation | `{age,fitnessGoal,experience}` -> `{recommendation}` |
| POST | /api/ai/fitness-insights | `{totalWorkouts,averageDuration,totalCaloriesBurned}` -> `{insight}` |

Categories: Cardio, Strength Training, Yoga, Running, Cycling, Walking.
