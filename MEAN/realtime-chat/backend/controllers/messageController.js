const Message = require('../models/Message');

// GET /api/messages?room=general
// Returns the last 50 messages for a room, oldest first.
exports.getMessages = async (req, res) => {
  try {
    const room = req.query.room || 'general';

    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages', details: err.message });
  }
};

// Used internally by the socket layer to persist a new message.
exports.saveMessage = async ({ room, username, text }) => {
  const message = new Message({ room, username, text });
  return message.save();
};
