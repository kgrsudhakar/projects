const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/messageController');

// GET /api/messages?room=general
router.get('/', getMessages);

module.exports = router;
