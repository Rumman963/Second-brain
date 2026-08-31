# SecondBrain — Backend

The API server for SecondBrain. Handles user accounts, saving content, deleting content, and generating public share links.

## What it does

- User accounts: sign up and sign in with a username and password
- Authentication: logged-in users get a JWT token, required for any private action
- Content storage: save, view, and delete content (videos, images, articles, audio) tied to each user
- Sharing: generate a public link so anyone can view a user's content without logging in, and disable it anytime

## Built with

Express, MongoDB with Mongoose, JWT (jsonwebtoken), TypeScript

## API endpoints

### Auth

| Method | Route | What it does |
|---|---|---|
| POST | `/api/v1/signup` | Create a new account |
| POST | `/api/v1/signin` | Log in, returns a JWT token |

### Content (requires login, token sent in the Authorization header)

| Method | Route | What it does |
|---|---|---|
| POST | `/api/v1/content` | Add new content (title, link, type) |
| GET | `/api/v1/content` | Get all content for the logged-in user |
| DELETE | `/api/v1/content` | Delete a content item by its id |

### Sharing

| Method | Route | What it does |
|---|---|---|
| POST | `/api/v1/brain/share` | Turn sharing on or off. Returns a link hash when turned on |
| GET | `/api/v1/brain/:shareLink` | Public route, no login needed. Returns the owner's username and content based on the hash in the URL |

## How authentication works

A user signs in, the backend checks the username and password, and if correct, signs a JWT containing the user's id. The frontend stores that token and sends it in the Authorization header on every request that needs login. A middleware checks the token before letting the request through, and attaches the user's id to the request so each route knows who's making it.

## How sharing works

When a user turns sharing on, the backend checks if they already have a link. If they do, it returns that same one. If not, it generates a random hash and saves it. That hash becomes a public URL. Anyone visiting it hits the public route, which looks up who owns that hash and returns their username and content. Turning sharing off deletes the link, so the URL stops working.

## Environment variables

This project needs a `.env` file with:

```
MONGO_URL=your_mongodb_connection_string
JWT_PASSWORD=your_jwt_secret
```

A `.env.example` file is included as a template. Never commit your actual `.env` file, it's already in `.gitignore`.

## Database models

- User: username, password
- Content: title, link, type (video, image, article, audio), tags, userId (owner)
- Tag: title (not actively used by the frontend yet)
- Link: hash, userId (used for sharing)

## Folder structure

```
src/
├── config.ts       JWT secret, loaded from environment variables
├── db.ts           MongoDB connection and Mongoose schemas
├── middleware.ts   checks the JWT token, protects private routes
├── util.ts         random string generator, used for share link hashes
├── override.d.ts   adds userId to Express's Request type
└── index.ts        all API routes
```

## Running it locally

```bash
npm install
npm run dev
```

Needs a `.env` file and a working MongoDB connection. Runs on port 3000 by default.

## Deployment

Deployed on Render. `MONGO_URL` and `JWT_PASSWORD` are set as environment variables in the Render dashboard instead of a file.

