# MEAN Real-Time Chat

A small real-time chat application built with the MEAN stack:

- **M**ongoDB — stores chat message history (via Mongoose)
- **E**xpress — REST API for message history + hosts the Socket.IO server
- **A**ngular — chat UI (join screen, message list, online users, typing indicator)
- **N**ode.js — server runtime

Real-time delivery is powered by **Socket.IO**: messages, presence (who's online),
and typing indicators are all pushed live to every connected client in the room —
no polling.

## Project Structure

```
mean-realtime-chat/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/Message.js         # Mongoose schema
│   ├── controllers/messageController.js
│   ├── routes/messageRoutes.js   # GET /api/messages?room=general
│   ├── server.js                 # Express app + Socket.IO server
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── chat/             # ChatComponent (main UI)
    │   │   ├── services/
    │   │   │   ├── socket.service.ts   # Socket.IO client wrapper
    │   │   │   └── chat.service.ts     # REST calls for history
    │   │   ├── models/message.model.ts
    │   │   ├── app.module.ts
    │   │   └── app.component.ts
    │   ├── environments/environment.ts
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    ├── package.json
    ├── tsconfig.json
    └── tsconfig.app.json
```

`node_modules` is intentionally **not** included — install dependencies yourself
with the commands below.

## How It Works (real-time flow)

1. User enters a name + room and clicks **Join Room**.
2. Angular calls the REST endpoint `GET /api/messages?room=...` to load the last
   50 messages from MongoDB (chat history).
3. Angular emits a `join_room` socket event; the server adds the user to that
   Socket.IO room and broadcasts an updated presence list.
4. When a user sends a message, Angular emits `send_message`. The server saves
   it to MongoDB, then broadcasts `receive_message` to everyone in that room —
   including the sender — so every client renders from the same source of truth.
5. Typing state is emitted (debounced client-side) and broadcast as
   `typing_update` so other users see a live "X is typing..." indicator.
6. On disconnect, the server updates presence and notifies the room.

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a connection string to Atlas/remote instance)
- Angular CLI (`npm install -g @angular/cli`) — or just use the local `ng` via `npx`

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit MONGO_URI if needed
npm run dev            # starts on http://localhost:5000 (uses nodemon)
# or: npm start
```

### 2. Frontend

```bash
cd frontend
npm install
npx ng serve           # starts on http://localhost:4200
```

Open two browser windows/tabs at `http://localhost:4200`, join the same room
with different names, and messages/typing/presence will sync live between them.

## Notes / Possible Extensions
- Add JWT auth and per-user identity instead of a free-text username.
- Add multiple rooms with a room list/switcher UI.
- Add message pagination ("load older messages") beyond the last 50.
- Add `OnPush` change detection to `ChatComponent` since state updates flow
  through explicit Observables — good interview talking point.
- Swap `HttpClientModule`/NgModule bootstrap for standalone components if
  targeting a newer Angular baseline.
