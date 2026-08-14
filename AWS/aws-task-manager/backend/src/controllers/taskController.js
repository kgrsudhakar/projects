import * as taskService from "../services/taskService.js";

export async function getTasks(req, res, next) {
  try {
    const result = await taskService.listTasks(req.user.id);

    res.json({
      success: true,
      cacheSource: result.source,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: "title is required"
      });
    }

    const task = await taskService.createTask(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(
      req.user.id,
      Number(req.params.id),
      req.body
    );

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const result = await taskService.deleteTask(
      req.user.id,
      Number(req.params.id)
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}
