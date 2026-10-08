import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../features/tasks/tasksSlice";

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskItem({ task }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleStatusChange = (e) => {
    dispatch(updateTask({ id: task.id, status: e.target.value }));
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) {
      dispatch(deleteTask(task.id));
    }
  };

  const handleSaveEdit = () => {
    dispatch(updateTask({ id: task.id, title, description }));
    setIsEditing(false);
  };

  return (
    <li className={`task-item priority-${task.priority}`}>
      <div className="task-main">
        {isEditing ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="edit-input"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="edit-input"
            />
            <div className="task-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="task-header">
              <strong>{task.title}</strong>
              <span className={`badge badge-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            <div className="task-meta">
              <select value={task.status} onChange={handleStatusChange}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {task.due_date && (
                <span className="due-date">Due: {task.due_date}</span>
              )}
            </div>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <button onClick={handleDelete} className="danger">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}
