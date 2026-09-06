import express from "express";
import db from "./database.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/journal", (req, res) => {
  const entries = db
    .prepare(
      `
        SELECT
          id,
          title,
          content,
          date,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM journal_entries
        ORDER BY date DESC, id DESC
      `,
    )
    .all();

  res.json(entries);
});

app.post("/api/journal", (req, res) => {
  const { title, content, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({
      error: "Title and date are required.",
    });
  }

  const result = db
    .prepare(
      `
        INSERT INTO journal_entries (title, content, date)
        VALUES (?, ?, ?)
      `,
    )
    .run(title, content ?? "", date);

  const entry = db
    .prepare(
      `
        SELECT
          id,
          title,
          content,
          date,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM journal_entries
        WHERE id = ?
      `,
    )
    .get(result.lastInsertRowid);

  res.status(201).json(entry);
});

app.patch("/api/journal/:id", (req, res) => {
  const { id } = req.params;
  const { title, content, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({
      error: "Title and date are required.",
    });
  }

  const result = db
    .prepare(
      `
        UPDATE journal_entries
        SET
          title = ?,
          content = ?,
          date = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
    )
    .run(title, content ?? "", date, id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Journal entry not found.",
    });
  }

  const entry = db
    .prepare(
      `
        SELECT
          id,
          title,
          content,
          date,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM journal_entries
        WHERE id = ?
      `,
    )
    .get(id);

  res.json(entry);
});

app.delete("/api/journal/:id", (req, res) => {
  const { id } = req.params;

  const result = db
    .prepare(
      `
        DELETE FROM journal_entries
        WHERE id = ?
      `,
    )
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Journal entry not found.",
    });
  }

  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});

app.get("/api/tasks", (req, res) => {
  const tasks = db
    .prepare(
      `
        SELECT
          id,
          title,
          completed,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM tasks
        ORDER BY completed ASC, id DESC
      `,
    )
    .all();

  res.json(
    tasks.map((task) => ({
      ...task,
      completed: Boolean(task.completed),
    })),
  );
});

app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required.",
    });
  }

  const result = db
    .prepare(
      `
        INSERT INTO tasks (title)
        VALUES (?)
      `,
    )
    .run(title);

  const task = db
    .prepare(
      `
        SELECT
          id,
          title,
          completed,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM tasks
        WHERE id = ?
      `,
    )
    .get(result.lastInsertRowid);

  res.status(201).json({
    ...task,
    completed: Boolean(task.completed),
  });
});

app.patch("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (!title || typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Title and completed state are required.",
    });
  }

  const result = db
    .prepare(
      `
        UPDATE tasks
        SET
          title = ?,
          completed = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
    )
    .run(title, completed ? 1 : 0, id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  const task = db
    .prepare(
      `
        SELECT
          id,
          title,
          completed,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM tasks
        WHERE id = ?
      `,
    )
    .get(id);

  res.json({
    ...task,
    completed: Boolean(task.completed),
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  const result = db
    .prepare(
      `
        DELETE FROM tasks
        WHERE id = ?
      `,
    )
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  res.status(204).send();
});
app.get("/api/notes", (req, res) => {
  const notes = db
    .prepare(
      `
        SELECT
          id,
          title,
          content,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM notes
        ORDER BY id DESC
      `,
    )
    .all();

  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required.",
    });
  }

  const result = db
    .prepare(
      `
        INSERT INTO notes (title, content)
        VALUES (?, ?)
      `,
    )
    .run(title, content ?? "");

  const note = db
    .prepare(
      `
        SELECT
          id,
          title,
          content,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM notes
        WHERE id = ?
      `,
    )
    .get(result.lastInsertRowid);

  res.status(201).json(note);
});

app.patch("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Title is required.",
    });
  }

  const result = db
    .prepare(
      `
        UPDATE notes
        SET
          title = ?,
          content = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
    )
    .run(title, content ?? "", id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Note not found.",
    });
  }

  const note = db
    .prepare(
      `
        SELECT
          id,
          title,
          content,
          created_at AS createdAt,
          updated_at AS updatedAt
        FROM notes
        WHERE id = ?
      `,
    )
    .get(id);

  res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  const result = db
    .prepare(
      `
        DELETE FROM notes
        WHERE id = ?
      `,
    )
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Note not found.",
    });
  }

  res.status(204).send();
});