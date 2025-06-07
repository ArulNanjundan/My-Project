'use client'

import { useEffect, useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')

  // Fetch todos
  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
  }, [])

  // Add a new todo
  const addTodo = async () => {
    if (!newTitle.trim()) return

    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    })

    const added = await res.json()
    setTodos([...todos, added])
    setNewTitle('')
  }

  // Toggle complete (frontend only for now)
  const toggleComplete = (id: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          📝 My Todo List
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter a task..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            ➕ Add
          </button>
        </div>

        <ul className="space-y-3">
          {todos.map(todo => (
            <li
              key={todo.id}
              className={`flex justify-between items-center border rounded p-3 shadow-sm transition ${
                todo.completed ? 'bg-green-100' : 'bg-yellow-50'
              }`}
            >
              <span
                className={`text-lg ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.title}
              </span>

              <button
                onClick={() => toggleComplete(todo.id)}
                className={`text-sm px-3 py-1 rounded transition ${
                  todo.completed
                    ? 'bg-gray-400 text-white hover:bg-gray-500'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {todo.completed ? 'Not Done' : 'Finish'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
