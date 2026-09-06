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