# CodeVault

CodeVault is a developer-focused code snippet manager for saving, organizing, searching, favoriting, versioning, and publicly sharing reusable code.

Live demo: `LIVE_DEMO_URL`  
Repository: `GITHUB_REPOSITORY_URL`

## Features

- JWT authentication with HTTP-only cookies
- Create, update, soft-delete, restore, and view snippets
- Tags, language and visibility filters, full-text-style search, and favorites
- Public/private sharing through unique slugs
- Snippet version history
- Owner-protected collections and snippet resources
- Dashboard statistics, responsive pages, loading states, and toast feedback
- Helmet, CORS, rate limiting, validation, query sanitization, and consistent errors

## Screenshots

Screenshots are not included in this repository yet. Add real product screenshots here after deployment.

## Tech stack

- Frontend: React, Vite, React Router, Axios, Monaco Editor, React Markdown, Lucide React, Recharts
- Backend: Node.js, Express, Mongoose, MongoDB, JWT, bcrypt, Helmet, CORS
- Deployment: Render frontend/backend and MongoDB Atlas

## Architecture

The frontend calls the Express API. Controllers delegate business rules to services, services enforce ownership, and Mongoose models persist data in MongoDB. See [docs/architecture.md](docs/architecture.md), [docs/api.md](docs/api.md), and [docs/database.md](docs/database.md).

## Project structure

```text
backend/
	src/config controllers middleware models routes services utils
	test/api.test.js
frontend/
	src/components context hooks layouts pages services styles utils
docs/
	architecture.md api.md database.md deployment.md
```

## Installation

```bash
git clone GITHUB_REPOSITORY_URL
cd CodeVault
cd backend && npm install
cd ../frontend && npm install
```

Copy the example environment files and set real local values. Never commit secrets.

## Environment variables

Backend (`backend/.env`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/codevault
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
OPENAI_API_KEY=
OPENAI_TAGS_MODEL=gpt-4o-mini
```

AI tag suggestions are optional and require a server-side `OPENAI_API_KEY`. The key is never sent to the frontend; snippet code and description are sent to OpenAI only when a user requests suggestions.

Frontend (`frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

## Local development

Start MongoDB, then run the services in separate terminals:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

The backend health endpoint is `/api/health`. The frontend uses `VITE_API_URL` and sends credentials for cookie authentication.

## API documentation

See [docs/api.md](docs/api.md) for endpoint methods, authentication, request fields, responses, and errors.

## Database models

The application defines `User`, `Snippet`, `SnippetVersion`, and `Collection` models. See [docs/database.md](docs/database.md).

## Authentication and security

Passwords are bcrypt-hashed. JWTs are stored in HTTP-only cookies. Protected services verify resource ownership, private snippets are not publicly readable, and inputs are validated and sanitized. Production deployment requires HTTPS for secure cross-site cookies.

## Testing

Backend integration tests use `mongodb-memory-server` and exercise the API over HTTP:

```bash
cd backend
npm test
```

The frontend production build is checked with:

```bash
cd frontend
npm run build
```

## Deployment on Render

Create a backend web service from `backend` with start command `npm start`, and a frontend static site from `frontend` with build command `npm run build` and publish directory `dist`. Configure `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV`, and Render's `PORT` on the backend; configure `VITE_API_URL` on the frontend. Full instructions are in [docs/deployment.md](docs/deployment.md).

## Future roadmap

- Add settings/profile screens if required by product scope
- Add a hosted screenshot gallery and real live-demo link after deployment
- Add richer diff presentation and pagination for large snippet collections
- Add optional GitHub import/OAuth only after the core workflows remain stable