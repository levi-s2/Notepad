import { useState } from "react";

const initialEntries = [
  {
    id: 1,
    title: "A Productive Day",
    content:
      "Today I worked on my Notepad application. I think the idea is starting to come together.",
    date: "2026-09-05",
  },
  {
    id: 2,
    title: "A Long Day",
    content:
      "Today was a long day. I got through everything I needed to do and finally had some time to relax.",
    date: "2026-09-04",
  },
  {
    id: 3,
    title: "Some Thoughts",
    content:
      "I've been thinking about the things I want to accomplish over the next few months.",
    date: "2026-09-02",
  },
];

function Journal() {
  const [entries, setEntries] = useState(initialEntries);
  const [selectedEntryId, setSelectedEntryId] = useState(initialEntries[0].id);

  const selectedEntry = entries.find(
    (entry) => entry.id === selectedEntryId,
  );

  function handleNewEntry() {
    const newEntry = {
      id: Date.now(),
      title: "Untitled Entry",
      content: "",
      date: new Date().toISOString().split("T")[0],
    };

    setEntries((currentEntries) => [newEntry, ...currentEntries]);
    setSelectedEntryId(newEntry.id);
  }

  function handleTitleChange(event) {
    const title = event.target.value;

    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === selectedEntryId ? { ...entry, title } : entry,
      ),
    );
  }

  function handleContentChange(event) {
    const content = event.target.value;

    setEntries((currentEntries) =>
      currentEntries.map((entry) =>
        entry.id === selectedEntryId ? { ...entry, content } : entry,
      ),
    );
  }

  function handleDeleteEntry() {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== selectedEntryId),
    );

    const remainingEntries = entries.filter(
      (entry) => entry.id !== selectedEntryId,
    );

    setSelectedEntryId(remainingEntries[0]?.id ?? null);
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
          {selectedEntry ? (
            <>
              <input
                type="text"
                value={selectedEntry.title}
                onChange={handleTitleChange}
                placeholder="Entry title"
              />

              <p className="journal-date">{selectedEntry.date}</p>

              <textarea
                value={selectedEntry.content}
                onChange={handleContentChange}
                placeholder="Write about your day..."
              />

              <div className="journal-actions">
                <button type="button" onClick={handleDeleteEntry}>
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