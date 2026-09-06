import { useState } from "react";

const initialNotes = [
  {
    id: 1,
    title: "Project Ideas",
    content:
      "Ideas for future projects and things I would like to build.",
  },
  {
    id: 2,
    title: "Linux Setup",
    content:
      "Things I want to configure and improve on my Linux machine.",
  },
  {
    id: 3,
    title: "Books to Read",
    content:
      "A list of books I want to read when I have some free time.",
  },
  {
    id: 4,
    title: "Random Thoughts",
    content:
      "A place to write down random ideas before I forget them.",
  },
];

function Notes() {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(initialNotes[0].id);
  const [search, setSearch] = useState("");

  const selectedNote = notes.find(
    (note) => note.id === selectedNoteId,
  );

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  function handleNewNote() {
    const newNote = {
      id: Date.now(),
      title: "Untitled Note",
      content: "",
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedNoteId(newNote.id);
  }

  function handleTitleChange(event) {
    const title = event.target.value;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId ? { ...note, title } : note,
      ),
    );
  }

  function handleContentChange(event) {
    const content = event.target.value;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId ? { ...note, content } : note,
      ),
    );
  }

  function handleDeleteNote() {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== selectedNoteId),
    );

    const remainingNotes = notes.filter(
      (note) => note.id !== selectedNoteId,
    );

    setSelectedNoteId(remainingNotes[0]?.id ?? null);
  }

  return (
    <section className="notes">
      <div className="notes-header">
        <h2>Notes</h2>

        <button type="button" onClick={handleNewNote}>
          + New Note
        </button>
      </div>

      <div className="notes-content">
        <aside className="notes-list">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes..."
          />

          {filteredNotes.length === 0 ? (
            <p className="empty-notes">No notes found.</p>
          ) : (
            filteredNotes.map((note) => (
              <button
                type="button"
                key={note.id}
                className={
                  note.id === selectedNoteId
                    ? "note-item active"
                    : "note-item"
                }
                onClick={() => setSelectedNoteId(note.id)}
              >
                {note.title}
              </button>
            ))
          )}
        </aside>

        <div className="note-editor">
          {selectedNote ? (
            <>
              <input
                type="text"
                value={selectedNote.title}
                onChange={handleTitleChange}
                placeholder="Note title"
              />

              <textarea
                value={selectedNote.content}
                onChange={handleContentChange}
                placeholder="Write your note..."
              />

              <div className="note-actions">
                <button type="button" onClick={handleDeleteNote}>
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="notes-empty-state">
              <p>Select a note or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Notes;