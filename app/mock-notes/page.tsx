'use client'

import React, { useEffect, useState } from 'react'
import { listNotes, addNote } from '@/packages/integrations/notion/notesync/notesync.function'

interface Note {
  id: string
  title: string
}

export default function MockNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newTitle, setNewTitle] = useState('')

  const fetchNotes = async () => {
    const data = await listNotes({})
    setNotes(data)
  }

  const handleAdd = async () => {
    if (!newTitle.trim()) return
    await addNote({ title: newTitle })
    setNewTitle('')
    fetchNotes()
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">📝 Notesync - Notes Viewer</h1>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Add new note title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />
          <button
            onClick={handleAdd}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            ➕ Add Note
          </button>
        </div>

        <div className="space-y-2">
          {notes.map(note => (
            <div
              key={note.id}
              className="bg-gray-50 border px-4 py-2 rounded-lg shadow-sm"
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
