'use client';

import React, { useEffect, useState } from 'react';

type Note = {
  id: string;
  title: string;
  content: string;
};

export default function MockNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetch('/api/mock-notes')
      .then((res) => res.json())
      .then((data) => setNotes(data.notes))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addNote = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setNewTitle('');
    setNewContent('');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <main
      style={{
        maxWidth: '700px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'linear-gradient(135deg, #e1bee7, #ce93d8)',
        borderRadius: '20px',
        border: '2px solid black',
        fontFamily: 'sans-serif',
        backgroundColor:'violet'
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#1b1b1b', fontSize: '2rem' }}>
        My Notes
      </h1>

      <div style={{ marginTop: '2rem' }}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem',
            marginBottom: '0.5rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor:'blue',
            color:'white',
            fontWeight:'bold'
          }}
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '0.6rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor:'white'
          }}
        />
        <button
          onClick={addNote}
          style={{
            marginTop: '0.75rem',
            background: '#689f38',
            color: '#fff',
            border: 'none',
            padding: '0.7rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Add Note
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading notes...</p>
      ) : (
        <ul style={{ marginTop: '2rem', listStyle: 'none', padding: 0 }}>
          {notes.map((note) => (
            <li
              key={note.id}
              style={{
                background: '#ffffff',
                border: '2px solid black',
                borderRadius: '20px',
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{
                marginBottom: '0.5rem',
                color: '#000000',
                fontWeight: 700,
                borderBottom: '1px solid black',
                paddingBottom: '0.25rem',
              }}>{note.title}</h3>
              <p style={{ whiteSpace: 'pre-line', color: '#444' }}>{note.content}</p>
              <button
                onClick={() => deleteNote(note.id)}
                style={{
                  marginTop: '0.75rem',
                  background: '#e53935',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
          {notes.length === 0 && (
            <li>
              <p style={{ textAlign: 'center', color: '#999' }}>No notes found.</p>
            </li>
          )}
        </ul>
      )}
    </main>
  );
}
