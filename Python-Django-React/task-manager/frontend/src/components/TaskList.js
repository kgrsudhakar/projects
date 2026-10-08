import React from "react";
import { useSelector } from "react-redux";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { items, status, error } = useSelector((state) => state.tasks);

  if (status === "loading") {
    return <p className="info-text">Loading tasks...</p>;
  }

  if (status === "failed") {
    return <p className="error-text">Error: {JSON.stringify(error)}</p>;
  }

  if (items.length === 0) {
    return <p className="info-text">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="task-list">
      {items.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
