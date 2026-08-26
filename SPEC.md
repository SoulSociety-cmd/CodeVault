You are a senior full-stack software engineer and UI/UX designer.

Build a complete production-ready full-stack web application called "CodeVault".

==================================================
1. PROJECT OVERVIEW
==================================================

CodeVault is a modern developer-focused code snippet management platform.

The main purpose is to allow developers and students to:

- Save reusable code snippets
- Organize snippets with tags and collections
- Search snippets quickly
- Filter snippets by programming language
- Favorite important snippets
- Edit and delete snippets
- View syntax-highlighted code
- Share snippets publicly through a unique URL
- Keep version history of snippets
- Compare different versions using a diff viewer
- View personal coding statistics

The application should feel like a real SaaS product, not a basic CRUD demo.

The UI should be modern, minimal, professional, developer-oriented, and responsive.

Do NOT make the interface look childish or like a beginner tutorial project.

==================================================
2. TECH STACK
==================================================

Frontend:

- React
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS
- Monaco Editor
- React Markdown
- Lucide React icons

Backend:

- Node.js
- Express.js
- JavaScript ES Modules
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- Helmet
- CORS
- Morgan
- dotenv

Deployment target:

- Frontend: Render
- Backend: Render
- Database: MongoDB Atlas

Do not introduce TypeScript unless absolutely necessary.

Do not replace React/Vite with Next.js.

Do not replace MongoDB with PostgreSQL.

==================================================
3. DESIGN SYSTEM
==================================================

Create a professional dark-first developer dashboard.

Primary visual style:

- Dark background
- Subtle borders
- Rounded cards
- Clean spacing
- Monospace typography where appropriate
- Professional developer tooling aesthetic
- Minimal animations
- Good contrast
- Responsive layout

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Huge decorative elements
- Cartoon-like UI
- Excessive emojis
- Oversized text
- Generic landing-page templates

Support:

- Dark mode
- Light mode

Use Lucide icons instead of manually created SVG icons.

Create reusable UI components.

==================================================
4. APPLICATION STRUCTURE
==================================================

The application should contain:

Public pages:

- Landing page
- Login
- Register
- Public snippet page
- 404 page

Authenticated pages:

- Dashboard
- My Snippets
- Create Snippet
- Edit Snippet
- Snippet Details
- Favorites
- Collections
- Settings
- Profile

Main navigation:

Sidebar:

- Dashboard
- My Snippets
- Favorites
- Collections
- Trash
- Settings

Top navigation:

- Global search
- Theme toggle
- User avatar
- User menu

==================================================
5. LANDING PAGE
==================================================

Create a polished landing page.

Hero:

Title:

"Your Code. Organized."

Subtitle:

"Save, organize, search, and share your most useful code snippets in one place."

Buttons:

- Get Started
- Explore Public Snippets

Sections:

1. Hero
2. Features
3. How it works
4. Developer workflow
5. Statistics / social proof style section
6. CTA
7. Footer

Do not use fake customer testimonials.

Do not invent fake companies or fake user counts.

==================================================
6. AUTHENTICATION
==================================================

Implement:

- Register
- Login
- Logout
- Get current user
- Protected routes

Register fields:

- username
- email
- password
- confirmPassword

Validation:

- Valid email
- Password minimum 8 characters
- Password confirmation must match
- Username minimum 3 characters

Password:

- Hash using bcrypt
- NEVER store plaintext passwords

Authentication:

Use JWT.

Prefer HTTP-only cookies for storing authentication tokens.

Backend middleware:

requireAuth

The frontend should automatically redirect unauthenticated users to /login.

==================================================
7. DATABASE MODELS
==================================================

Create the following Mongoose models.

-------------------------
User
-------------------------

Fields:

_id
username
email
passwordHash
avatar
createdAt
updatedAt

Email must be unique.

Username must be unique.

-------------------------
Snippet
-------------------------

Fields:

_id
owner
title
description
code
language
tags
visibility
slug
views
favorites
collectionIds
createdAt
updatedAt

Rules:

owner references User.

visibility:

- private
- public

slug must be unique.

Use timestamps.

-------------------------
Collection
-------------------------

Fields:

_id
owner
name
description
snippets
createdAt
updatedAt

-------------------------
SnippetVersion
-------------------------

Fields:

_id
snippetId
version
code
createdBy
createdAt

Every time a snippet is updated, create a new version.

Version numbers should increment automatically.

==================================================
8. SNIPPET MANAGEMENT
==================================================

Users can:

- Create snippets
- Read snippets
- Update snippets
- Delete snippets
- Restore deleted snippets
- Permanently delete snippets

Snippet fields:

Title
Description
Code
Language
Tags
Visibility
Collection

Supported languages:

- C
- C++
- Java
- Python
- JavaScript
- TypeScript
- HTML
- CSS
- SQL
- JSON
- Bash
- Go
- Rust
- PHP

Use Monaco Editor.

The editor must support:

- Syntax highlighting
- Line numbers
- Code folding
- Minimap
- Word wrap toggle
- Font size control
- Read-only mode

==================================================
9. SNIPPET DETAILS PAGE
==================================================

Display:

- Title
- Description
- Language
- Tags
- Author
- Created date
- Updated date
- View count
- Favorite count
- Visibility

Code section:

- Monaco Editor in read-only mode
- Copy button
- Download button
- Fullscreen button

Actions:

- Edit
- Delete
- Favorite
- Share

For public snippets:

Show:

"Public"

and provide a shareable URL.

==================================================
10. SEARCH
==================================================

Implement global snippet search.

Search should match:

- title
- description
- tags
- language
- code

Example:

GET /api/snippets/search?q=binary

Results should return relevant snippets.

Implement debounced search on frontend.

Search UI should display:

- Result count
- Matching snippets
- Language
- Tags
- Last updated

==================================================
11. FILTERING
==================================================

Add filters:

Language
Tags
Visibility
Collection
Favorite

Sorting:

- Recently updated
- Recently created
- Most viewed
- Most favorited
- Alphabetical

Filters should be combinable.

Example:

Language = C++

Tag = algorithm

Sort = Recently updated

==================================================
12. FAVORITES
==================================================

Users can favorite/unfavorite snippets.

Create:

POST /api/snippets/:id/favorite

DELETE /api/snippets/:id/favorite

Favorites page should show all favorited snippets.

Each snippet card should contain:

- Title
- Language
- Tags
- Last updated
- Favorite state

==================================================
13. TAG SYSTEM
==================================================

Allow multiple tags per snippet.

Example:

#algorithm
#binary-search
#leetcode
#cpp

Tags should be searchable.

Create a popular tags section.

Display:

Tag name
Number of snippets

Clicking a tag filters snippets.

==================================================
14. COLLECTIONS
==================================================

Users can create collections.

Example:

DSA
Competitive Programming
React
Backend
MongoDB
Interview Preparation

Collection page should display:

- Collection name
- Description
- Number of snippets
- Snippets inside collection

Users can:

- Create collection
- Rename collection
- Delete collection
- Add snippet to collection
- Remove snippet from collection

==================================================
15. PUBLIC SHARING
==================================================

Every public snippet should have a unique URL:

/s/:slug

Example:

/s/binary-search-8f3k29

Public users do NOT need an account to view public snippets.

Public page should contain:

- Snippet title
- Description
- Author
- Code
- Language
- Tags
- View count
- Copy button

Private snippets must NEVER be accessible through public URLs.

==================================================
16. VIEW COUNTER
==================================================

Every public snippet view should increment the view counter.

Avoid counting repeated refreshes aggressively.

Implement a reasonable mechanism to prevent obvious view spam.

==================================================
17. VERSION HISTORY
==================================================

Every time a snippet is updated:

Create a SnippetVersion.

Example:

Version 1
Version 2
Version 3

Version history page:

--------------------------------
Version History

v3    Aug 27, 2026
v2    Aug 26, 2026
v1    Aug 24, 2026
--------------------------------

Users can select two versions.

Example:

Compare:

v1 vs v3

Display Monaco Diff Editor.

Left side:

Old version

Right side:

New version

Use Monaco's diff editor.

==================================================
18. DASHBOARD
==================================================

Dashboard should show:

Total snippets
Public snippets
Private snippets
Favorites
Total views

Language statistics.

Example:

C++          54
JavaScript   31
Python       24
Java         12
Other         7

Show a chart for language distribution.

Also show:

Recent snippets

Most viewed snippets

Most favorited snippets

Recent activity

==================================================
19. SNIPPET CARD
==================================================

Create a reusable SnippetCard component.

Example:

------------------------------------------
Binary Search

C++

Search algorithm using divide and conquer.

#algorithm #binary-search #cpp

⭐ 12     👁 142

Updated 2 hours ago
------------------------------------------

Actions:

- Open
- Edit
- Favorite
- Delete

==================================================
20. GLOBAL SEARCH
==================================================

Top navbar should contain:

Search snippets...

When user types:

Show autocomplete / quick results.

Example:

Search:

"jwt"

Results:

JWT Authentication
JWT Middleware
JWT Token Decoder

Press Enter:

Navigate to search results page.

==================================================
21. CODE COPY
==================================================

Every code block should have:

Copy button.

When copied:

Show toast:

"Code copied to clipboard."

Do not use browser alert().

Use a reusable toast system.

==================================================
22. DOWNLOAD CODE
==================================================

Allow users to download snippet code.

File extension should depend on language.

Examples:

C++ -> .cpp
Python -> .py
JavaScript -> .js
TypeScript -> .ts
Java -> .java
HTML -> .html
CSS -> .css
SQL -> .sql

Filename should be generated from snippet title.

==================================================
23. MARKDOWN
==================================================

Snippet descriptions should support Markdown.

Render Markdown safely.

Support:

- Headings
- Lists
- Bold
- Italic
- Code blocks
- Links

Prevent XSS.

==================================================
24. ERROR HANDLING
==================================================

Backend should return consistent error format:

{
  "success": false,
  "message": "Human readable error message"
}

Success:

{
  "success": true,
  "data": {}
}

Frontend should handle:

- Network errors
- 400
- 401
- 403
- 404
- 409
- 500

Show useful error states.

Never expose stack traces to users.

==================================================
25. LOADING STATES
==================================================

Implement proper loading states.

Use:

- Skeleton loaders
- Loading spinners where appropriate
- Disabled buttons during requests

Do not make the application feel frozen during API calls.

==================================================
26. EMPTY STATES
==================================================

Create good empty states.

Example:

No snippets:

"You haven't saved any snippets yet."

Button:

"+ Create your first snippet"

No favorites:

"No favorite snippets yet."

No collections:

"Create a collection to organize your snippets."

==================================================
27. RESPONSIVE DESIGN
==================================================

Desktop:

Full sidebar.

Tablet:

Collapsible sidebar.

Mobile:

Mobile navigation.

The application must work correctly on:

- Desktop
- Laptop
- Tablet
- Mobile

Monaco Editor must remain usable on smaller screens.

==================================================
28. SECURITY
==================================================

Implement:

- Helmet
- CORS
- Rate limiting where appropriate
- Input validation
- MongoDB query sanitization
- Password hashing
- JWT authentication
- Authorization checks

Important:

A user must NEVER be able to:

- Edit another user's snippet
- Delete another user's snippet
- View another user's private snippet
- Modify another user's collection
- Access another user's version history

Validate ownership on every protected resource.

Never trust IDs from the frontend.

==================================================
29. API STRUCTURE
==================================================

Auth:

POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

Snippets:

GET    /api/snippets
POST   /api/snippets
GET    /api/snippets/:id
PUT    /api/snippets/:id
DELETE /api/snippets/:id
POST   /api/snippets/:id/restore

Search:

GET    /api/snippets/search

Favorites:

POST   /api/snippets/:id/favorite
DELETE /api/snippets/:id/favorite

Versions:

GET    /api/snippets/:id/versions
GET    /api/snippets/:id/versions/:version

Collections:

GET    /api/collections
POST   /api/collections
GET    /api/collections/:id
PUT    /api/collections/:id
DELETE /api/collections/:id

Public:

GET    /api/public/snippets/:slug

Health:

GET    /api/health

Health response:

{
  "status": "ok"
}

==================================================
30. BACKEND ARCHITECTURE
==================================================

Use a clean architecture.

backend/

src/

config/
controllers/
middleware/
models/
routes/
services/
utils/

Example:

controllers/
    authController.js
    snippetController.js
    collectionController.js

services/
    authService.js
    snippetService.js
    searchService.js

middleware/
    authMiddleware.js
    errorMiddleware.js
    validationMiddleware.js

models/
    User.js
    Snippet.js
    Collection.js
    SnippetVersion.js

routes/
    authRoutes.js
    snippetRoutes.js
    collectionRoutes.js

==================================================
31. FRONTEND ARCHITECTURE
==================================================

Use:

src/

components/
pages/
layouts/
hooks/
services/
context/
utils/
lib/

Reusable components:

Button
Input
Modal
Dialog
Toast
Dropdown
Badge
Card
SnippetCard
CodeEditor
SearchBar
Sidebar
Navbar
EmptyState
LoadingSkeleton
ConfirmDialog

Avoid duplicated UI logic.

==================================================
32. API SERVICE
==================================================

Create a centralized Axios client.

Example:

src/services/api.js

Configure:

- baseURL
- credentials
- interceptors

Create services:

authService.js
snippetService.js
collectionService.js
searchService.js

Do not scatter raw axios requests throughout components.

==================================================
33. STATE MANAGEMENT
==================================================

Do not install Redux unless necessary.

Use:

- React Context
- useState
- useReducer
- custom hooks

Create:

AuthContext

Use it to manage:

- currentUser
- login
- logout
- loading state

==================================================
34. ENVIRONMENT VARIABLES
==================================================

Frontend:

VITE_API_URL

Backend:

PORT
MONGODB_URI
JWT_SECRET
FRONTEND_URL
NODE_ENV

Create:

.env.example

Never commit real secrets.

==================================================
35. README
==================================================

Create a professional README.md.

README must include:

# CodeVault

Short description.

Features.

Screenshots section.

Tech stack.

Architecture.

Project structure.

Installation.

Environment variables.

Local development.

API documentation.

Database models.

Authentication.

Security.

Deployment on Render.

Future roadmap.

Do not put fake URLs.

Use placeholders where appropriate:

LIVE_DEMO_URL

GITHUB_REPOSITORY_URL

==================================================
36. DOCUMENTATION
==================================================

Create:

docs/

architecture.md
api.md
database.md
deployment.md

API documentation should include:

Endpoint
Method
Authentication
Request body
Response
Error responses

==================================================
37. TESTING
==================================================

Add backend tests for important functionality.

At minimum test:

- Register
- Login
- Authentication
- Create snippet
- Update snippet
- Delete snippet
- Ownership protection
- Public/private access
- Favorite
- Search

Do not claim tests pass unless they actually pass.

==================================================
38. CODE QUALITY
==================================================

Use:

- Clear naming
- Small functions
- Reusable components
- Proper error handling
- No unnecessary duplication
- No console.log spam
- No hardcoded secrets
- No fake API responses

Avoid overengineering.

Code should be understandable to a second-year CS student.

==================================================
39. GIT COMMIT STRATEGY
==================================================

Do NOT create one giant commit.

Structure the implementation into meaningful commits.

Example:

feat: initialize full-stack project

feat: add authentication system

feat: add snippet CRUD

feat: integrate Monaco editor

feat: add snippet search

feat: add tags and filtering

feat: add favorites

feat: add collections

feat: add public snippet sharing

feat: add snippet version history

feat: add Monaco diff viewer

feat: add dashboard analytics

feat: improve responsive design

fix: improve snippet authorization

docs: add project documentation

chore: prepare Render deployment

==================================================
40. DEPLOYMENT
==================================================

Prepare the project for Render.

Frontend:

Build command:

npm run build

Backend:

Start command:

npm start

Backend must listen on:

process.env.PORT

Do NOT hardcode port 5000 for production.

Configure CORS using FRONTEND_URL.

MongoDB should use MongoDB Atlas.

Provide deployment instructions in README.

==================================================
41. IMPORTANT DEVELOPMENT RULES
==================================================

Do not build everything as a single huge file.

Do not use mock data in the final application.

Do not leave TODO placeholders for core functionality.

Do not skip authentication.

Do not skip authorization.

Do not expose private snippets.

Do not hardcode localhost URLs.

Use environment variables.

Do not create unnecessary dependencies.

Do not use deprecated libraries.

Keep the project maintainable.

==================================================
42. IMPLEMENTATION ORDER
==================================================

Implement in this exact order:

PHASE 1:

Project setup
Frontend
Backend
MongoDB connection
Environment configuration

PHASE 2:

Authentication
User model
JWT
Protected routes

PHASE 3:

Snippet CRUD
Snippet model
Create
Read
Update
Delete

PHASE 4:

Monaco Editor
Syntax highlighting
Copy
Download

PHASE 5:

Search
Filtering
Sorting
Tags

PHASE 6:

Favorites
Collections

PHASE 7:

Public sharing
Slug generation
View counter

PHASE 8:

Version history
Monaco Diff Editor

PHASE 9:

Dashboard
Statistics
Charts

PHASE 10:

Responsive design
Loading states
Empty states
Error handling
Toast notifications

PHASE 11:

Security improvements
Validation
Authorization
Rate limiting

PHASE 12:

Testing
Documentation
README
Deployment configuration

==================================================
43. OPTIONAL PHASE 2 FEATURES
==================================================

After the core application is stable, optionally add:

GitHub OAuth

GitHub repository import

Import code files

AI code explanation

AI code improvement

AI-generated tags

AI-generated descriptions

Do NOT implement these before the core application is stable.

==================================================
44. FINAL QUALITY BAR
==================================================

The final result should feel like:

"A real developer SaaS application created by a junior/full-stack developer."

It should NOT feel like:

"A basic CRUD tutorial project."

Prioritize:

1. Functionality
2. Clean architecture
3. Security
4. UX
5. Responsive design
6. Documentation
7. Deployment readiness

Before finishing:

- Run frontend build
- Run backend
- Verify MongoDB connection
- Test authentication
- Test CRUD
- Test search
- Test favorites
- Test collections
- Test public sharing
- Test version history
- Test authorization
- Test production build

Fix all discovered errors before declaring the project complete.

At the end, provide:

1. Final project structure
2. Setup instructions
3. Environment variables
4. API endpoint summary
5. Features implemented
6. Testing status
7. Deployment instructions
8. Future improvements

Do not claim something is implemented unless it actually exists in the code.