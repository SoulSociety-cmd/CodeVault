# Architecture

CodeVault is a React/Vite frontend backed by an Express 5 API and MongoDB through Mongoose.

## Runtime flow

1. The frontend calls `/api` endpoints with Axios and sends the HTTP-only JWT cookie.
2. Express applies Helmet, CORS, Morgan, JSON parsing, cookies, input sanitization, validation, and route middleware.
3. Controllers translate HTTP requests into service calls.
4. Services enforce ownership and business rules before reading or writing Mongoose models.
5. The error middleware returns the common `{ success: false, message }` shape.

## Backend structure

- `config`: database connection
- `controllers`: HTTP handlers
- `middleware`: authentication, validation, sanitization, and errors
- `models`: User, Snippet, SnippetVersion, and Collection schemas
- `routes`: API route registration
- `services`: business logic and authorization checks
- `utils`: shared backend utilities

## Frontend structure

- `pages`: route-level screens
- `components`: reusable UI pieces
- `layouts`: authenticated layout composition
- `context` and `hooks`: authentication and toast state
- `services`: API calls
- `utils` and `lib`: shared helpers

## Authentication and authorization

Successful register/login responses set an HTTP-only `token` cookie containing a JWT. `requireAuth` verifies the token and loads the user. Resource services compare the authenticated user ID with the resource owner for snippets, collections, and version history.
