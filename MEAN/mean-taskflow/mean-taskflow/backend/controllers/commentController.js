const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Project = require('../models/Project');

async function assertMemberForTask(taskId, userId) {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error('Task not found');
    err.statusCode = 404;
    throw err;
  }
  const project = await Project.findById(task.project);
  const isMember = project.members.some((m) => m.equals(userId)) || project.owner.equals(userId);
  if (!isMember) {
    const err = new Error('Not authorized for this task');
    err.statusCode = 403;
    throw err;
  }
  return task;
}

exports.getComments = async (req, res, next) => {
  try {
    await assertMemberForTask(req.params.taskId, req.user._id);
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('author', 'name email avatarColor')
      .sort({ createdAt: 1 });
    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text is required' });

    const task = await assertMemberForTask(req.params.taskId, req.user._id);
    const comment = await Comment.create({ task: task._id, author: req.user._id, text: text.trim() });
    const populated = await comment.populate('author', 'name email avatarColor');

    const io = req.app.get('io');
    if (io) io.to(`project:${task.project}`).emit('comment:created', { taskId: task._id, comment: populated });

    res.status(201).json({ comment: populated });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (!comment.author.equals(req.user._id)) return res.status(403).json({ message: 'You can only delete your own comments' });

    const task = await Task.findById(comment.task);
    await comment.deleteOne();

    const io = req.app.get('io');
    if (io && task) io.to(`project:${task.project}`).emit('comment:deleted', { taskId: task._id, commentId: req.params.id });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};
