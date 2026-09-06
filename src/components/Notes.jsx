import { useEffect, useState } from "react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const response = await fetch("/api/notes");

        if (!response.ok) {
          throw new Error("Failed to load notes.");
        }

        const data = await response.json();

        setNotes(data);
        setSelectedNoteId(data[0]?.id ?? null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
  }, []);

  useEffect(() => {
    const selectedNote = notes.find(
      (note) => note.id === selectedNoteId,
    );

    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNoteId, notes]);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  async function handleNewNote() {
    const newNote = {
      title: "Untitled Note",
      content: "",
    };

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error("Failed to create note.");
      }

      const createdNote = await response.json();

      setNotes((currentNotes) => [
        createdNote,
        ...currentNotes,
      ]);

      setSelectedNoteId(createdNote.id);
    } catch (error) {
      console.error(error);
    }
  }

  async function saveNote() {
    if (!selectedNoteId) return;

    const selectedNote = notes.find(
      (note) => note.id === selectedNoteId,
    );

    if (!selectedNote) return;

    if (
      title === selectedNote.title &&
      content === selectedNote.content
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/notes/${selectedNoteId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update note.");
      }

      const savedNote = await response.json();

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === savedNote.id ? savedNote : note,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteNote() {
    if (!selectedNoteId) return;

    try {
      const response = await fetch(
        `/api/notes/${selectedNoteId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete note.");
      }

      const remainingNotes = notes.filter(
        (note) => note.id !== selectedNoteId,
      );

      setNotes(remainingNotes);
      setSelectedNoteId(remainingNotes[0]?.id ?? null);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <section className="notes">Loading...</section>;
  }

  return (
    <section className="notes">
      <div className="page-header">
        <h2>Notes</h2>

        <button type="button" onClick={handleNewNote}>
          + New Note
        </button>
      </div>

      <div className="editor-layout">
        <aside className="editor-sidebar">
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

        <div className="editor-content">
          {selectedNoteId ? (
            <>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onBlur={saveNote}
                placeholder="Note title"
              />

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onBlur={saveNote}
                placeholder="Write your note..."
              />

              <div className="editor-actions">
                <button
                  type="button"
                  onClick={handleDeleteNote}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Select a note or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Notes;