# Taskly – MERN To-Do List

A full-stack to-do app where **every user only sees and manages their own tasks**.

## Features
- Register and log in (passwords hashed with bcrypt)
- JWT authentication, protected API routes and protected React routes
- Create, read, update (title / done), delete tasks
- Strict per-user data isolation (ownership checked on the server)
- Loading, error and empty states; filter by All / Active / Completed; responsive UI

## Tech Stack
MongoDB (Mongoose) · Express · React (Vite, React Router, Axios) · Node.js

## Project Structure
```
mern-todo-list/
├── client/   React frontend (pages, components, context, services)
└── server/   Express API (config, controllers, middleware, models, routes)
```

## Setup

### 1. Prerequisites
Node.js 18+ and a MongoDB Atlas cluster (or a local MongoDB).

### 2. Configure environment
Edit `server/.env` (copied from `.env.example`):
```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<long random string>
CLIENT_URL=http://localhost:5173
```
`client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Install and run
```bash
cd server && npm install && npm run dev      # API on :5000
cd client && npm install && npm run dev      # App on :5173
```
Or from the root: `npm run install-all`, then `npm run server` and `npm run client` in two terminals.

## API Endpoints

| Method | Endpoint             | Auth | Description          |
|--------|----------------------|------|----------------------|
| POST   | /api/auth/register   | No   | Create account       |
| POST   | /api/auth/login      | No   | Log in, returns JWT  |
| GET    | /api/auth/me         | Yes  | Current user         |
| GET    | /api/todos           | Yes  | List my tasks        |
| POST   | /api/todos           | Yes  | Create a task        |
| PUT    | /api/todos/:id       | Yes  | Update my task       |
| DELETE | /api/todos/:id       | Yes  | Delete my task       |

Send the token as `Authorization: Bearer <token>`.

## Database

- **users**: `_id, name, email (unique), password (hashed), createdAt`
- **todos**: `_id, title, description, completed, userId → users._id, createdAt, updatedAt`

## How user isolation works
`userId` is never taken from the request body. The auth middleware verifies the JWT and sets `req.user`; every query filters by `userId: req.user._id`, and update/delete look up tasks by both `_id` and `userId`, returning 404 for tasks that belong to someone else.

## Testing the isolation
1. Register `rakesh@gmail.com`, add *Task A* and *Task B*.
2. Log out, register `arun@gmail.com`, add *Task C*.
3. Each account sees only its own tasks.

## Deployment notes
- Backend (e.g. Render): set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your frontend URL), `NODE_ENV=production`.
- Frontend (e.g. Vercel/Netlify): set `VITE_API_URL=https://<your-backend>/api`, build `npm run build`, output `dist`, and add an SPA rewrite of all routes to `index.html`.
- In MongoDB Atlas, allow your backend's IP under Network Access.

## Future improvements
Refresh tokens, due dates and priorities, drag-and-drop ordering, automated tests.
