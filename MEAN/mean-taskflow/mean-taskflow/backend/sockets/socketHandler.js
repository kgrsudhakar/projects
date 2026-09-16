const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Tracks which users are currently viewing which project room, for presence indicators.
// Shape: { [projectId]: Map<userId, { name, avatarColor, socketIds: Set }> }
const presence = {};

function addPresence(projectId, user, socketId) {
  if (!presence[projectId]) presence[projectId] = new Map();
  const room = presence[projectId];
  if (!room.has(user._id.toString())) {
    room.set(user._id.toString(), { name: user.name, avatarColor: user.avatarColor, socketIds: new Set() });
  }
  room.get(user._id.toString()).socketIds.add(socketId);
}

function removePresence(projectId, userId, socketId) {
  const room = presence[projectId];
  if (!room || !room.has(userId)) return;
  const entry = room.get(userId);
  entry.socketIds.delete(socketId);
  if (entry.socketIds.size === 0) room.delete(userId);
  if (room.size === 0) delete presence[projectId];
}

function listPresence(projectId) {
  const room = presence[projectId];
  if (!room) return [];
  return Array.from(room.entries()).map(([userId, v]) => ({ userId, name: v.name, avatarColor: v.avatarColor }));
}

module.exports = function initSocket(io) {
  // Authenticate every socket connection using the same JWT used for the REST API
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    // Personal room, used to push project-list-level updates (e.g. added to a project)
    socket.join(`user:${user._id}`);

    socket.on('project:join', (projectId) => {
      socket.join(`project:${projectId}`);
      addPresence(projectId, user, socket.id);
      io.to(`project:${projectId}`).emit('presence:update', listPresence(projectId));
    });

    socket.on('project:leave', (projectId) => {
      socket.leave(`project:${projectId}`);
      removePresence(projectId, user._id.toString(), socket.id);
      io.to(`project:${projectId}`).emit('presence:update', listPresence(projectId));
    });

    socket.on('typing:start', ({ projectId, taskId }) => {
      socket.to(`project:${projectId}`).emit('typing:start', { taskId, user: { id: user._id, name: user.name } });
    });

    socket.on('typing:stop', ({ projectId, taskId }) => {
      socket.to(`project:${projectId}`).emit('typing:stop', { taskId, user: { id: user._id, name: user.name } });
    });

    socket.on('disconnecting', () => {
      for (const room of socket.rooms) {
        if (room.startsWith('project:')) {
          const projectId = room.replace('project:', '');
          removePresence(projectId, user._id.toString(), socket.id);
          io.to(room).emit('presence:update', listPresence(projectId));
        }
      }
    });
  });
};
