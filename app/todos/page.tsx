
'use client';

import React, { useEffect, useState } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/todos')
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;

    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' },
    });

    const newTodo = await res.json();
    setTodos((prev) => [...prev, newTodo]);
    setTitle('');
  };

  const toggleCompleted = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  if (!mounted) return null;

  return (
    <main
      style={{
        padding: '2rem',
        background: '#f0f4c3',
        borderRadius: '12px',
        margin: '2rem auto',
        maxWidth: '700px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ fontSize: '2rem', textAlign: 'center', color: '#33691e' }}>
         Todo List
      </h1>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '2px solid black',
            fontSize: '1rem',
            color:'black',
            fontWeight:'bold',
          }}
        />
        <button
          onClick={addTodo}
          style={{
            background: '#558b2f',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.25rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ marginTop: '2rem', padding: 0, listStyle: 'none' }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              background: todo.completed ? '#aed581' : '#fff',
              color: todo.completed ? '#1b5e20' : '#212121',
              fontWeight: 500,
              padding: '1rem',
              marginBottom: '0.75rem',
              borderRadius: '10px',
              border: '1px solid #c5e1a5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ flex: 1 }}>{todo.title}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => toggleCompleted(todo.id)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: todo.completed ? '#d84315' : '#43a047',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {todo.completed ? 'Not Finish' : 'Finish'}
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#c62828',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
