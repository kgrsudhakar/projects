import { useEffect, useState } from "react";
import api from "./api";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(endpoint, form);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  }

  return (
    <div className="center">
      <form className="card auth" onSubmit={submit}>
        <h1>AWS Task Manager</h1>
        <p>{mode === "login" ? "Sign in" : "Create account"}</p>

        {mode === "register" && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <div className="error">{error}</div>}

        <button>{mode === "login" ? "Login" : "Register"}</button>

        <button
          type="button"
          className="secondary"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Create a new account"
            : "Already have an account?"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [cacheSource, setCacheSource] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM"
  });
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.data);
      setCacheSource(data.cacheSource);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    try {
      await api.post("/tasks", form);
      setForm({
        title: "",
        description: "",
        priority: "MEDIUM"
      });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create task");
    }
  }

  async function updateStatus(task, status) {
    try {
      await api.put(`/tasks/${task.id}`, { status });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task");
    }
  }

  async function removeTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  }

  return (
    <div className="page">
      <header>
        <div>
          <h1>Task Dashboard</h1>
          <span>Welcome, {user.name}</span>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <main>
        <section className="card">
          <h2>Create Task</h2>

          <form onSubmit={addTask} className="task-form">
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
            </select>

            <button>Add Task</button>
          </form>
        </section>

        <section className="card">
          <div className="list-header">
            <h2>My Tasks</h2>
            <span className="cache">Data source: {cacheSource || "-"}</span>
          </div>

          {error && <div className="error">{error}</div>}

          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="tasks">
              {tasks.map((task) => (
                <article className="task" key={task.id}>
                  <div>
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <small>
                      Priority: {task.priority} | Status: {task.status}
                    </small>
                  </div>

                  <div className="actions">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(task, e.target.value)
                      }
                    >
                      <option>TODO</option>
                      <option>IN_PROGRESS</option>
                      <option>DONE</option>
                    </select>

                    <button
                      className="danger"
                      onClick={() => removeTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return user ? (
    <Dashboard user={user} onLogout={() => setUser(null)} />
  ) : (
    <Login onLogin={setUser} />
  );
}
