const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');

router.use(auth);

router.get('/task/:taskId', getComments);
router.post('/task/:taskId', addComment);
router.delete('/:id', deleteComment);

module.exports = router;
