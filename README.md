# SecondBrain — Backend

The API server for SecondBrain — handles user accounts, saving content, deleting content, and generating public share links.

## What this backend does

- **User accounts** — sign up and sign in with a username/password
- **Authentication** — logged-in users get a token (JWT) that's required for any private action
- **Content storage** — save, view, and delete content (videos, images, articles, audio) tied to each user
- **Sharing** — generate a public link that lets anyone view a user's content without logging in, and disable it anytime

## Tech Stack

- **Express** — API server
- **MongoDB + Mongoose** — database
- **JWT (jsonwebtoken)** — authentication
- **TypeScript**

## API Endpoints

### Auth

| Method | Route | What it does |
|---|---|---|
| POST | `/api/v1/signup` | Create a new account (`username`, `password`) |
| POST | `/api/v1/signin` | Log in, returns a JWT token |

### Content (requires login — send token in `Authorization` header)

| Method | Route | What it does |
|---|---|---|
| POST | `/api/v1/content` | Add new content (`title`, `link`, `type`) |
| GET | `/api/v1/content` | Get all content belonging to the logged-in user |
| DELETE | `/api/v1/content` | Delete a content item by `contentId` |

### Sharing

| Method | Route | What it does |
|---|---|---|
| POST | `/api/v1/brain/share` | Turn sharing on (`share: true`) or off (`share: false`) for the logged-in user. Returns a `hash` when turned on |
| GET | `/api/v1/brain/:shareLink` | Public route — no login needed. Returns the owner's username and content, based on the hash in the URL |

## How authentication works

1. User signs in → backend checks username/password → if correct, signs a JWT containing the user's ID
2. Frontend stores this token (in `localStorage`)
3. For every private request (add/view/delete content, share brain), the token is sent in the `Authorization` header
4. `userMiddleware` verifies the token before letting the request through, and attaches `req.userId` so routes know which user is making the request

## How sharing works

1. Logged-in user sends `POST /brain/share` with `{share: true}`
2. Backend checks if a share link already exists for this user — reuses it if so, otherwise creates a new random `hash` and saves it
3. That hash becomes part of a public URL (`/share/:hash` on the frontend)
4. Anyone visiting that URL hits `GET /brain/:shareLink` (no login needed) — backend looks up which user owns that hash, and returns their username + content
5. Sending `POST /brain/share` with `{share: false}` deletes the link, so the URL stops working

## Database Models

- **User** — `username`, `password`
- **Content** — `title`, `link`, `type` (video/image/article/audio), `tags`, `userId` (owner)
- **Tag** — `title` (not actively used in the frontend yet)
- **Link** — `hash`, `userId` (used for sharing)

## Folder structure

```
src/
├── config.ts       → JWT secret
├── db.ts           → MongoDB connection + Mongoose schemas/models
├── middleware.ts    → checks JWT token, protects private routes
├── util.ts         → random string generator (used for share link hashes)
├── override.d.ts    → TypeScript type extension (adds userId to Express's Request)
└── index.ts        → all API routes
```

## Running locally

```bash
npm install
npm run dev
```

Make sure MongoDB is reachable (connection string is set in `db.ts`), and the server runs on port `3000` by default.

