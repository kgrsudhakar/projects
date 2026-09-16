const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const User = require('../models/User');

// helper to emit to every member of a project (their personal room) + the project room
function emitToProject(req, project, event, payload) {
  const io = req.app.get('io');
  if (!io) return;
  io.to(`project:${project._id}`).emit(event, payload);
  const memberIds = [project.owner.toString(), ...project.members.map((m) => m.toString())];
  [...new Set(memberIds)].forEach((uid) => io.to(`user:${uid}`).emit(event, payload));
}

exports.createProject = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await Project.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [req.user._id]
    });
    const populated = await project.populate('owner members', 'name email avatarColor');
    emitToProject(req, populated, 'project:created', populated);
    res.status(201).json({ project: populated });
  } catch (err) {
    next(err);
  }
};

exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    })
      .populate('owner members', 'name email avatarColor')
      .sort({ updatedAt: -1 });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner members', 'name email avatarColor');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const isMember = project.members.some((m) => m._id.equals(req.user._id)) || project.owner._id.equals(req.user._id);
    if (!isMember) return res.status(403).json({ message: 'Not authorized to view this project' });
    res.json({ project });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the owner can update the project' });

    ['name', 'description', 'color'].forEach((field) => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });
    await project.save();
    const populated = await project.populate('owner members', 'name email avatarColor');
    emitToProject(req, populated, 'project:updated', populated);
    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the owner can delete the project' });

    const taskIds = await Task.find({ project: project._id }).distinct('_id');
    await Comment.deleteMany({ task: { $in: taskIds } });
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    emitToProject(req, project, 'project:deleted', { _id: project._id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the owner can add members' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No user found with that email' });
    if (project.members.some((m) => m.equals(user._id))) {
      return res.status(409).json({ message: 'User is already a member' });
    }
    project.members.push(user._id);
    await project.save();
    const populated = await project.populate('owner members', 'name email avatarColor');
    emitToProject(req, populated, 'project:updated', populated);
    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (!project.owner.equals(req.user._id)) return res.status(403).json({ message: 'Only the owner can remove members' });

    project.members = project.members.filter((m) => m.toString() !== req.params.userId);
    await project.save();
    const populated = await project.populate('owner members', 'name email avatarColor');
    emitToProject(req, populated, 'project:updated', populated);
    res.json({ project: populated });
  } catch (err) {
    next(err);
  }
};
