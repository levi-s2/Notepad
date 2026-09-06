import { useEffect, useState } from "react";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      try {
        const response = await fetch("/api/journal");

        if (!response.ok) {
          throw new Error("Failed to load journal entries.");
        }

        const data = await response.json();

        setEntries(data);
        setSelectedEntryId(data[0]?.id ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  useEffect(() => {
    const selectedEntry = entries.find(
      (entry) => entry.id === selectedEntryId,
    );

    if (selectedEntry) {
      setTitle(selectedEntry.title);
      setContent(selectedEntry.content);
    }
  }, [selectedEntryId, entries]);

  async function saveEntry(updates) {
    if (!selectedEntryId) return;

    const selectedEntry = entries.find(
      (entry) => entry.id === selectedEntryId,
    );

    if (!selectedEntry) return;

    const updatedEntry = {
      ...selectedEntry,
      title,
      content,
      ...updates,
    };

    try {
      const response = await fetch(
        `/api/journal/${selectedEntryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: updatedEntry.title,
            content: updatedEntry.content,
            date: updatedEntry.date,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update journal entry.");
      }

      const savedEntry = await response.json();

      setEntries((currentEntries) =>
        currentEntries.map((entry) =>
          entry.id === savedEntry.id ? savedEntry : entry,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleNewEntry() {
    const newEntry = {
      title: "Untitled Entry",
      content: "",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) {
        throw new Error("Failed to create journal entry.");
      }

      const createdEntry = await response.json();

      setEntries((currentEntries) => [
        createdEntry,
        ...currentEntries,
      ]);

      setSelectedEntryId(createdEntry.id);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteEntry() {
    if (!selectedEntryId) return;

    try {
      const response = await fetch(
        `/api/journal/${selectedEntryId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete journal entry.");
      }

      const remainingEntries = entries.filter(
        (entry) => entry.id !== selectedEntryId,
      );

      setEntries(remainingEntries);
      setSelectedEntryId(remainingEntries[0]?.id ?? null);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <section className="journal">Loading...</section>;
  }

  return (
    <section className="journal">
      <div className="journal-header">
        <h2>Journal</h2>

        <button type="button" onClick={handleNewEntry}>
          + New Entry
        </button>
      </div>

      <div className="journal-content">
        <aside className="journal-entries">
          <h3>Entries</h3>

          {entries.length === 0 ? (
            <p>No entries yet.</p>
          ) : (
            entries.map((entry) => (
              <button
                type="button"
                key={entry.id}
                className={
                  entry.id === selectedEntryId
                    ? "journal-entry active"
                    : "journal-entry"
                }
                onClick={() => setSelectedEntryId(entry.id)}
              >
                <span>{entry.title}</span>
                <small>{entry.date}</small>
              </button>
            ))
          )}
        </aside>

        <div className="journal-editor">
          {selectedEntryId ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={() => saveEntry()}
                placeholder="Entry title"
              />

              <p className="journal-date">
                {entries.find(
                  (entry) => entry.id === selectedEntryId,
                )?.date}
              </p>

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onBlur={() => saveEntry()}
                placeholder="Write about your day..."
              />

              <div className="journal-actions">
                <button
                  type="button"
                  onClick={handleDeleteEntry}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="journal-empty">
              <p>Select an entry or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Journal;