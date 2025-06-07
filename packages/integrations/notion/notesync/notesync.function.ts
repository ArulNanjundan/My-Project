import { ListNotesInput, AddNoteInput } from './notesync.schema'

let notes = [
  { id: '1', title: 'Learn Next.js' },
  { id: '2', title: 'Build a mock integration' },
  { id: '3', title: 'Deploy to Vercel' },
]

export async function listNotes(input: ListNotesInput) {
  const { query, maxResults = 3 } = input
  let result = notes

  if (query) {
    result = result.filter(note => note.title.toLowerCase().includes(query.toLowerCase()))
  }

  return result.slice(0, maxResults)
}

export async function addNote(input: AddNoteInput) {
  const newNote = { id: String(notes.length + 1), title: input.title }
  notes.unshift(newNote)
  return newNote
}