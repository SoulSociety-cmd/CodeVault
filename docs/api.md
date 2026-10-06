# API Reference

Unless stated otherwise, success responses use `{ "success": true, "data": {} }` and errors use `{ "success": false, "message": "..." }`. Authenticated endpoints require the HTTP-only `token` cookie.

## Health

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/api/health` | No | None | `{ status: "ok" }` |

## Auth

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `username`, `email`, `password`, `confirmPassword` | 201 with `user` |
| POST | `/api/auth/login` | No | `email`, `password` | 200 with `user` |
| POST | `/api/auth/logout` | No | None | Logout confirmation |
| GET | `/api/auth/me` | Yes | None | Current `user` |

Validation errors return 400, invalid credentials/authentication return 401, and duplicate account data returns 409.

## Snippets and search

| Method | Endpoint | Auth | Body/query | Response |
|---|---|---|---|---|
| GET | `/api/snippets` | Yes | Query filters: `q`, `language`, `tag(s)`, `visibility`, `favorite`, `collection`, `sort` | `snippets`, `count` |
| POST | `/api/snippets` | Yes | `title`, `code`, `language`; optional `description`, `tags`, `visibility`, `collectionIds` | 201 with `snippet` |
| GET | `/api/snippets/:id` | Yes, owner | None | `snippet` |
| PUT | `/api/snippets/:id` | Yes, owner | Snippet fields | Updated `snippet` |
| DELETE | `/api/snippets/:id` | Yes, owner | None | Soft-deleted `snippet` |
| POST | `/api/snippets/:id/restore` | Yes, owner | None | Restored `snippet` |
| GET | `/api/snippets/search` | Yes | Same search query filters | `snippets`, `count` |
| POST | `/api/snippets/suggest-tags` | Yes | `code`, `language`; optional `title`, `description`, `tags` | Suggested `tags` (does not modify a snippet) |
| POST/DELETE | `/api/snippets/:id/favorite` | Yes, owner | None | Updated `snippet` |
| PATCH | `/api/snippets/:id/visibility` | Yes, owner | `{ visibility: "public"|"private" }` | Updated `snippet` |

## Versions

| Method | Endpoint | Auth | Response |
|---|---|---|---|
| GET | `/api/snippets/:id/versions` | Yes, owner | `versions` |
| GET | `/api/snippets/:id/versions/:version` | Yes, owner | `version` |

## Collections

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| GET | `/api/collections` | Yes | None | `collections` |
| POST | `/api/collections` | Yes | `name`, optional `description` | 201 with `collection` |
| GET | `/api/collections/:id` | Yes, owner | None | `collection` |
| PUT | `/api/collections/:id` | Yes, owner | `name`, `description`, optional `snippets` | Updated `collection` |
| DELETE | `/api/collections/:id` | Yes, owner | None | Deleted `collection` |
| POST/DELETE | `/api/collections/:id/snippets/:snippetId` | Yes, owner | None | Updated `collection` |

## Public sharing

| Method | Endpoint | Auth | Response |
|---|---|---|---|
| GET | `/api/public/snippets/:slug` | No | Public `snippet`; private/deleted/missing slugs return 404 |

Common errors are 400 validation, 401 authentication, 403 ownership, 404 missing resources, 409 duplicate data, and 500 unexpected server errors.

Tag suggestions require the backend `OPENAI_API_KEY` environment variable. The optional `OPENAI_TAGS_MODEL` variable selects the OpenAI chat model. Snippet code and description are sent to that provider only when the user requests suggestions.
