const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      default: 'general',
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
