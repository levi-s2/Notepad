import { useState } from "react";

const initialTasks = [
  {
    id: 1,
    title: "Finish Notepad",
    completed: false,
  },
  {
    id: 2,
    title: "Work on portfolio",
    completed: false,
  },
  {
    id: 3,
    title: "Read",
    completed: false,
  },
  {
    id: 4,
    title: "Clean apartment",
    completed: false,
  },
  {
    id: 5,
    title: "Buy groceries",
    completed: true,
  },
  {
    id: 6,
    title: "Send email",
    completed: true,
  },
];

function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  function handleAddTask(event) {
    event.preventDefault();

    const title = newTask.trim();

    if (!title) {
      return;
    }

    const task = {
      id: Date.now(),
      title,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, task]);
    setNewTask("");
  }

  function handleToggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task,
      ),
    );
  }

  function handleDeleteTask(id) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id),
    );
  }

  function renderTask(task) {
    return (
      <div className="task-item" key={task.id}>
        <label>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleTask(task.id)}
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