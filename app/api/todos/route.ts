// app/api/todos/route.ts
import { NextResponse } from 'next/server'

type Todo = {
  id: number
  title: string
  completed: boolean
}

// In-memory store (will reset on server restart)
let todos: Todo[] = [
  { id: 1, title: 'Finish Next.js test', completed: false },
  { id: 2, title: 'Read documentation', completed: true },
]

// GET: Return the list of todos
export async function GET() {
  return NextResponse.json(todos)
}

// POST: Add a new todo item
export async function POST(req: Request) {
  const body = await req.json()

  const newTodo: Todo = {
    id: todos.length + 1,
    title: body.title || 'Untitled Task',
    completed: false,
  }

  todos.push(newTodo)

  return NextResponse.json(newTodo, { status: 201 })
}
