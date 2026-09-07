# Deployment on Render

Deploy the frontend and backend as separate Render services, and use MongoDB Atlas for persistence.

## Backend web service

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment: `NODE_ENV=production`
- Required variables: `PORT` (provided by Render), `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`

The backend listens on `process.env.PORT` and falls back to 5000 only for local development when the variable is absent.

## Frontend static site

- Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Required variable: `VITE_API_URL`, set to the deployed backend API base URL such as `https://your-backend.example/api`.

## CORS and cookies

Set `FRONTEND_URL` to the exact deployed frontend origin. Production authentication uses secure, HTTP-only, cross-site cookies, so both services must use HTTPS.

## Verification

After deployment, check `/api/health`, register/login, create a snippet, and open a public snippet URL. Never commit real secrets or Atlas credentials.
