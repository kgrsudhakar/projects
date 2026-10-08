import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, fetchTasks } from "../features/tasks/tasksSlice";

export default function FilterBar() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.tasks.filters);

  const applyFilters = (newFilters) => {
    const merged = { ...filters, ...newFilters };
    dispatch(setFilters(newFilters));
    dispatch(fetchTasks(merged));
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => applyFilters({ search: e.target.value })}
      />
      <select
        value={filters.status}
        onChange={(e) => applyFilters({ status: e.target.value })}
      >
        <option value="">All Statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        value={filters.priority}
        onChange={(e) => applyFilters({ priority: e.target.value })}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
