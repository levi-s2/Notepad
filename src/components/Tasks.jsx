import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDailyTask, setNewDailyTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

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

  const dailyTasks = tasks
    .filter((task) => task.isDaily)
    .sort((a, b) => a.position - b.position);

  const regularTasks = tasks
    .filter((task) => !task.isDaily)
    .sort((a, b) => a.position - b.position);

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
        body: JSON.stringify({
          title,
          isDaily: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task.");
      }

      const createdTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        createdTask,
      ]);

      setNewTask("");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddDailyTask(event) {
    event.preventDefault();

    const title = newDailyTask.trim();

    if (!title) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          isDaily: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create daily task.");
      }

      const createdTask = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        createdTask,
      ]);

      setNewDailyTask("");
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

  async function saveTaskOrder(orderedTasks) {
    const reorderedTasks = orderedTasks.map((task, index) => ({
      id: task.id,
      position: index,
    }));

    try {
      const response = await fetch("/api/tasks/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: reorderedTasks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save task order.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleDragStart(event, taskId) {
    setDraggedTaskId(taskId);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(taskId));
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event, targetTask, taskList) {
    event.preventDefault();

    const draggedId = Number(
      event.dataTransfer.getData("text/plain"),
    );

    if (!draggedId || draggedId === targetTask.id) {
      setDraggedTaskId(null);
      return;
    }

    const draggedIndex = taskList.findIndex(
      (task) => task.id === draggedId,
    );

    const targetIndex = taskList.findIndex(
      (task) => task.id === targetTask.id,
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedTaskId(null);
      return;
    }

    const reorderedTasks = [...taskList];
    const [draggedTask] = reorderedTasks.splice(
      draggedIndex,
      1,
    );

    reorderedTasks.splice(targetIndex, 0, draggedTask);

    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      position: index,
    }));

    setTasks((currentTasks) => {
      const otherTasks = currentTasks.filter(
        (task) => task.isDaily !== targetTask.isDaily,
      );

      return [...otherTasks, ...updatedTasks];
    });

    saveTaskOrder(updatedTasks);

    setDraggedTaskId(null);
  }

  function renderTask(task, taskList) {
    return (
      <div
        className={
          draggedTaskId === task.id
            ? "task-item dragging"
            : "task-item"
        }
        key={task.id}
        draggable
        onDragStart={(event) =>
          handleDragStart(event, task.id)
        }
        onDragOver={handleDragOver}
        onDrop={(event) =>
          handleDrop(event, task, taskList)
        }
        onDragEnd={() => setDraggedTaskId(null)}
      >
        <span className="task-drag-handle" aria-hidden="true">
          ⋮⋮
        </span>

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
      <div className="page-header">
        <h2>Tasks</h2>
      </div>

      <div className="content-section">
        <h3>Daily Tasks</h3>

        <div className="task-list">
          {dailyTasks.length === 0 ? (
            <p className="empty-state">No daily tasks.</p>
          ) : (
            dailyTasks.map((task) =>
              renderTask(task, dailyTasks),
            )
          )}
        </div>

        <form
          className="task-form"
          onSubmit={handleAddDailyTask}
        >
          <input
            type="text"
            value={newDailyTask}
            onChange={(event) =>
              setNewDailyTask(event.target.value)
            }
            placeholder="Add a daily task..."
          />

          <button type="submit">+</button>
        </form>
      </div>

      <div className="content-section">
        <h3>Tasks</h3>

        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTask}
            onChange={(event) =>
              setNewTask(event.target.value)
            }
            placeholder="Add a task..."
          />

          <button type="submit">+</button>
        </form>

        <div className="task-list">
          {regularTasks.length === 0 ? (
            <p className="empty-state">No tasks.</p>
          ) : (
            regularTasks.map((task) =>
              renderTask(task, regularTasks),
            )
          )}
        </div>
      </div>
    </section>
  );
}

export default Tasks;