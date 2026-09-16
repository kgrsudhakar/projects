const Task = require('../models/Task');
const Project = require('../models/Project');
const Comment = require('../models/Comment');

async function assertMember(projectId, userId) {
  const project = await Project.findById(projectId);
  if (!project) {
    const err = new Error('Project not found');
    err.statusCode = 404;
    throw err;
  }
  const isMember = project.members.some((m) => m.equals(userId)) || project.owner.equals(userId);
  if (!isMember) {
    const err = new Error('Not authorized for this project');
    err.statusCode = 403;
    throw err;
  }
  return project;
}

function emitToProject(req, projectId, event, payload) {
  const io = req.app.get('io');
  if (io) io.to(`project:${projectId}`).emit(event, payload);
}

exports.getTasks = async (req, res, next) => {
  try {
    await assertMember(req.params.projectId, req.user._id);
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee createdBy', 'name email avatarColor')
      .sort({ order: 1, createdAt: 1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, priority, assignee, dueDate, status } = req.body;
    await assertMember(req.params.projectId, req.user._id);
    if (!title) return res.status(400).json({ message: 'Task title is required' });

    const count = await Task.countDocuments({ project: req.params.projectId, status: status || 'todo' });

    const task = await Task.create({
      title,
      description,
      priority,
      assignee: assignee || null,
      dueDate: dueDate || null,
      status: status || 'todo',
      order: count,
      project: req.params.projectId,
      createdBy: req.user._id
    });
    const populated = await task.populate('assignee createdBy', 'name email avatarColor');
    emitToProject(req, req.params.projectId, 'task:created', populated);
    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await assertMember(task.project, req.user._id);

    ['title', 'description', 'status', 'priority', 'assignee', 'dueDate', 'order'].forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });
    await task.save();
    const populated = await task.populate('assignee createdBy', 'name email avatarColor');
    emitToProject(req, task.project, 'task:updated', populated);
    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
};

// Dedicated endpoint for drag-and-drop status/order changes (used heavily by the kanban board)
exports.moveTask = async (req, res, next) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await assertMember(task.project, req.user._id);

    task.status = status;
    task.order = order;
    await task.save();
    const populated = await task.populate('assignee createdBy', 'name email avatarColor');
    emitToProject(req, task.project, 'task:moved', populated);
    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await assertMember(task.project, req.user._id);

    await Comment.deleteMany({ task: task._id });
    await task.deleteOne();
    emitToProject(req, task.project, 'task:deleted', { _id: task._id, project: task.project });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
