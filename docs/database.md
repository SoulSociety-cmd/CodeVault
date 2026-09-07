# Database

CodeVault uses MongoDB with Mongoose. Set `MONGODB_URI` to a MongoDB Atlas connection string in deployed environments.

## User

Fields: `username` (unique), `email` (unique), `passwordHash`, `avatar`, and timestamps. Passwords are hashed with bcrypt and are never returned as plaintext.

## Snippet

Fields: `owner`, `title`, `description`, `code`, `language`, `tags`, `visibility`, unique `slug`, `views`, `favorites`, `collectionIds`, `deletedAt`, and timestamps. A soft delete sets `deletedAt` instead of removing the document.

## SnippetVersion

Stores `snippetId`, sequential `version`, `code`, `createdBy`, and timestamps. A version is created when a snippet is created and whenever its code is updated.

## Collection

Fields: `owner`, unique per-owner `name`, `description`, `snippets`, and timestamps. Collection operations validate that both the collection and referenced snippets belong to the authenticated user.

## Development database

The backend integration suite uses `mongodb-memory-server`, so tests do not write to a developer or Atlas database.
