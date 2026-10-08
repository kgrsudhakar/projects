import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTasks } from "./features/tasks/tasksSlice";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterBar from "./components/FilterBar";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>React + Redux Toolkit &middot; Django REST Framework &middot; SQLite</p>
      </header>
      <main>
        <TaskForm />
        <FilterBar />
        <TaskList />
      </main>
    </div>
  );
}
