import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false }
}, { timestamps: true });
const Task = mongoose.model('Task', taskSchema);

app.get('/api/health', (req, res) => res.json({ status: 'UP' }));

app.get('/api/tasks', async (req, res, next) => {
  try {
    res.json(await Task.find().sort({
      createdAt: -1
    }
    ));
  }
  catch (e) {
    next(e);
  }
});

app.post('/api/tasks', async (req, res, next) => {
  try {
    if (!req.body.title?.trim())
      return res.status(400).json({
        message: 'Title is required'
      });
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description
    });
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
});

app.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!task) return res.status(404).json({
      message: 'Task not found'
    });
    res.json(task);
  } catch (e) { next(e); }
});

app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({
      message: 'Task not found'
    });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});
app.use((err, req, res, next) => res.status(500).json({
  message: err.message || 'Internal server error'
}));

const port = process.env.PORT || 5000;
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/task');
console.log('MongoDB connected');
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
