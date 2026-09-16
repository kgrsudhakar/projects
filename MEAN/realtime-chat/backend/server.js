require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const messageRoutes = require('./routes/messageRoutes');
const { saveMessage } = require('./controllers/messageController');

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:4200';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// REST API (message history)
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);

// Real-time layer
const io = new Server(server, {
  cors: { origin: CLIENT_ORIGIN, methods: ['GET', 'POST'] },
});

// room -> Set of usernames currently online
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('join_room', ({ room, username }) => {
    socket.join(room);
    socket.data.room = room;
    socket.data.username = username;

    if (!onlineUsers.has(room)) onlineUsers.set(room, new Set());
    onlineUsers.get(room).add(username);

    io.to(room).emit('presence_update', Array.from(onlineUsers.get(room)));
    socket.to(room).emit('system_message', `${username} joined the room`);
  });

  socket.on('send_message', async ({ room, username, text }) => {
    if (!room || !username || !text || !text.trim()) return;

    try {
      const saved = await saveMessage({ room, username, text: text.trim() });
      // Broadcast to everyone in the room, including the sender,
      // so all clients render from the same persisted source of truth.
      io.to(room).emit('receive_message', saved);
    } catch (err) {
      socket.emit('error_message', 'Could not send message. Please try again.');
    }
  });

  socket.on('typing', ({ room, username, isTyping }) => {
    socket.to(room).emit('typing_update', { username, isTyping });
  });

  socket.on('disconnect', () => {
    const { room, username } = socket.data;
    if (room && username && onlineUsers.has(room)) {
      onlineUsers.get(room).delete(username);
      io.to(room).emit('presence_update', Array.from(onlineUsers.get(room)));
      socket.to(room).emit('system_message', `${username} left the room`);
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
