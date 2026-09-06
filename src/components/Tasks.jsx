import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
          throw new Error("Failed to load tasks.");
        }

        const data = await response.json();

        setTasks(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  async function handleAddTask(event) {
    event.preventDefault();

    const title = newTask.trim();

    if (!title) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task.");
      }

      const createdTask = await response.json();

      setTasks((currentTasks) => [
        createdTask,
        ...currentTasks,
      ]);

      setNewTask("");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleToggleTask(task) {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task.");
      }

      const updatedTask = await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id
            ? updatedTask
            : currentTask,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteTask(id) {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task.");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function renderTask(task) {
    return (
      <div className="task-item" key={task.id}>
        <label>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleTask(task)}
          />

          <span className={task.completed ? "completed" : ""}>
            {task.title}
          </span>
        </label>

        <button
          type="button"
          onClick={() => handleDeleteTask(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          ×
        </button>
      </div>
    );
  }

  if (loading) {
    return <section className="tasks">Loading...</section>;
  }

  return (
    <section className="tasks">
      <div className="tasks-header">
        <h2>Tasks</h2>
      </div>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          placeholder="Add a task..."
        />

        <button type="submit">+</button>
      </form>

      <div className="task-section">
        <h3>Tasks</h3>

        {activeTasks.length === 0 ? (
          <p className="empty-tasks">No tasks.</p>
        ) : (
          activeTasks.map(renderTask)
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="task-section completed-section">
          <h3>Completed</h3>

          {completedTasks.map(renderTask)}
        </div>
      )}
    </section>
  );
}

export default Tasks;