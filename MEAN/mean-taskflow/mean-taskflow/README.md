# TaskFlow — Real-Time Collaborative Project & Task Management (MEAN Stack)

A full-stack, real-time Kanban board built on **MongoDB, Express, Angular, and Node.js**,
with **Socket.io** powering live updates. Multiple people can work on the same project
board at once — task moves, comments, and member changes sync instantly across every
connected browser, with no page refresh.

## Features

- **JWT authentication** — register/login, passwords hashed with bcrypt
- **Projects** — create boards, invite teammates by email, owner-only settings
- **Kanban board** — To Do / In Progress / Done columns, drag-and-drop (or button-based) task moves
- **Tasks** — title, description, priority, assignee, due date
- **Real-time sync** — task create/update/move/delete, project updates, and membership
  changes broadcast instantly via Socket.io to everyone viewing that project
- **Live presence** — see who else currently has the board open
- **Threaded comments** on each task, synced live, with typing indicators
- **Responsive UI** built with Angular 17 standalone components (no NgModules)

## Tech stack

| Layer     | Technology                                  |
|-----------|----------------------------------------------|
| Frontend  | Angular 17 (standalone components, signals) |
| Backend   | Node.js, Express                            |
| Database  | MongoDB + Mongoose                          |
| Real-time | Socket.io                                   |
| Auth      | JSON Web Tokens + bcrypt                    |

## Project structure

```
mean-taskflow/
├── backend/                 # Express API + Socket.io server
│   ├── config/db.js         # MongoDB connection
│   ├── models/               # Mongoose schemas: User, Project, Task, Comment
│   ├── middleware/           # JWT auth guard, error handler
│   ├── controllers/          # Route handlers (also emit socket events)
│   ├── routes/                # Express routers
│   ├── sockets/socketHandler.js  # Socket.io auth, rooms, presence, typing
│   ├── server.js             # Entry point
│   └── .env.example
└── frontend/                 # Angular app
    └── src/app/
        ├── core/services/     # auth, socket, project, task services
        ├── core/interceptors/ # JWT header injection
        ├── core/guards/       # route guards
        └── pages/             # login, register, dashboard, project-board (kanban)
```

## Prerequisites

Install these locally before you start:

1. **Node.js 18+** and npm — https://nodejs.org
2. **MongoDB** running locally, OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
   - Local install (macOS): `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
   - Local install (Ubuntu/Debian): follow https://www.mongodb.com/docs/manual/administration/install-on-linux/
   - Or just run it in Docker: `docker run -d -p 27017:27017 --name taskflow-mongo mongo:7`
3. **Angular CLI** (installed automatically via `npx`, no global install required)

## Setup — Backend

```bash
cd backend
cp .env.example .env
npm install
```

Open `.env` and check the values — the defaults work for a local MongoDB install:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=change_this_to_a_long_random_secret_string   # ← change this
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:4200
```

If you're using MongoDB Atlas instead, replace `MONGO_URI` with your Atlas connection string.

Start the API server:

```bash
npm run dev     # with nodemon (auto-restart on changes)
# or
npm start       # plain node
```

You should see:
```
MongoDB connected: 127.0.0.1
TaskFlow API + Socket.io running on port 5000
```

Verify it's alive: open http://localhost:5000/api/health — you should get `{"status":"ok",...}`.

## Setup — Frontend

Open a **second terminal** (leave the backend running):

```bash
cd frontend
npm install
npm start
```

This runs `ng serve` with a dev proxy (`proxy.conf.json`) that forwards `/api` and
`/socket.io` requests to `http://localhost:5000`, so the Angular app and API don't
run into CORS issues in development.

Open **http://localhost:4200** in your browser.

## Trying out the real-time features

1. Register an account, then create a project from the dashboard.
2. Open the same project URL in a **second browser window** (or an incognito window,
   logged in as a second registered account you invite via **Invite → email**).
3. In one window, drag a task to a different column, add a comment, or edit the task
   title — watch it update instantly in the other window, with no refresh.
4. Notice the presence avatars in the top bar update as people open/close the board,
   and the typing indicator when someone is composing a comment on the task you have open.

## Building for production

```bash
cd frontend
npm run build            # outputs to frontend/dist/taskflow-frontend
```

Serve the built frontend with any static file server (or point Nginx at the `dist`
folder), and run the backend with `npm start` behind a process manager like PM2.
Remember to set `CLIENT_URL` in the backend `.env` to your deployed frontend's origin,
and to serve everything over HTTPS in production (Socket.io will use `wss://` automatically).

## API overview

| Method | Route                               | Description                     |
|--------|--------------------------------------|----------------------------------|
| POST   | `/api/auth/register`                | Create an account               |
| POST   | `/api/auth/login`                   | Sign in, get a JWT              |
| GET    | `/api/auth/me`                      | Current user                    |
| GET    | `/api/projects`                     | List your projects              |
| POST   | `/api/projects`                     | Create a project                |
| GET    | `/api/projects/:id`                 | Get one project                 |
| PUT    | `/api/projects/:id`                 | Update project (owner only)     |
| DELETE | `/api/projects/:id`                 | Delete project (owner only)     |
| POST   | `/api/projects/:id/members`         | Invite member by email          |
| DELETE | `/api/projects/:id/members/:userId` | Remove member                   |
| GET    | `/api/tasks/project/:projectId`     | List tasks in a project         |
| POST   | `/api/tasks/project/:projectId`     | Create a task                   |
| PUT    | `/api/tasks/:id`                    | Update a task                   |
| PATCH  | `/api/tasks/:id/move`               | Move task (status + order)      |
| DELETE | `/api/tasks/:id`                    | Delete a task                   |
| GET    | `/api/comments/task/:taskId`        | List comments on a task         |
| POST   | `/api/comments/task/:taskId`        | Add a comment                   |
| DELETE | `/api/comments/:id`                 | Delete your own comment         |

All routes except register/login require `Authorization: Bearer <token>`.

## Socket.io events

| Event               | Direction        | Payload                                |
|----------------------|-------------------|------------------------------------------|
| `project:join`       | client → server  | `projectId`                             |
| `project:leave`      | client → server  | `projectId`                             |
| `typing:start/stop`  | client → server  | `{ projectId, taskId }`                 |
| `project:created/updated/deleted` | server → client | project object |
| `task:created/updated/moved/deleted` | server → client | task object |
| `comment:created/deleted` | server → client | `{ taskId, comment }` |
| `presence:update`    | server → client  | array of users currently viewing        |
| `typing:start/stop`  | server → client  | `{ taskId, user }`                      |

## Troubleshooting

- **"MongoDB connection error"** — make sure MongoDB is running (`mongosh` should connect)
  and `MONGO_URI` in `.env` is correct.
- **Frontend loads but API calls fail / 401 on everything** — make sure the backend is
  running on port 5000 before starting the frontend, and that you're hitting
  `localhost:4200` (not opening `index.html` directly), so the dev proxy is active.
- **Socket connects but doesn't receive events** — check the browser console for
  socket auth errors; your JWT may have expired (7 days by default) — log out and back in.
