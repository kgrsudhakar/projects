import { query } from "../db.js";
import { redis } from "../redis.js";

const CACHE_TTL_SECONDS = 60;

function cacheKey(userId) {
  return `tasks:user:${userId}`;
}

export async function listTasks(userId) {
  const key = cacheKey(userId);

  if (redis.isOpen) {
    const cached = await redis.get(key);

    if (cached) {
      return {
        data: JSON.parse(cached),
        source: "redis"
      };
    }
  }

  const result = await query(
    `SELECT id, title, description, status, priority, created_at, updated_at
     FROM tasks
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  const tasks = result.rows;

  if (redis.isOpen) {
    await redis.setEx(key, CACHE_TTL_SECONDS, JSON.stringify(tasks));
  }

  return {
    data: tasks,
    source: "postgresql"
  };
}

export async function createTask(userId, data) {
  const { title, description = "", priority = "MEDIUM" } = data;

  const result = await query(
    `INSERT INTO tasks (title, description, priority, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, priority, userId]
  );

  await invalidateTaskCache(userId);

  return result.rows[0];
}

export async function updateTask(userId, taskId, data) {
  const existing = await query(
    "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
    [taskId, userId]
  );

  if (!existing.rowCount) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  const result = await query(
    `UPDATE tasks
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         priority = COALESCE($4, priority),
         updated_at = NOW()
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [
      data.title ?? null,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      taskId,
      userId
    ]
  );

  await invalidateTaskCache(userId);

  return result.rows[0];
}

export async function deleteTask(userId, taskId) {
  const result = await query(
    `DELETE FROM tasks
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [taskId, userId]
  );

  if (!result.rowCount) {
    const error = new Error("Task not found");
    error.status = 404;
    throw error;
  }

  await invalidateTaskCache(userId);

  return result.rows[0];
}

async function invalidateTaskCache(userId) {
  if (redis.isOpen) {
    await redis.del(cacheKey(userId));
  }
}
