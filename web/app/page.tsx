'use client';

import { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, type Todo } from '@/lib/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const todo = await createTodo(newTodo);
      setTodos([todo, ...todos]);
      setNewTodo('');
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  async function handleToggle(todo: Todo) {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === todo.id ? updated : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <main style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Todo App</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          Tambah Tugas Update
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            padding: '0.5rem',
            marginBottom: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#999' : 'inherit'
              }}>
                {todo.title}
              </span>
            </label>
            <button
              onClick={() => handleDelete(todo.id)}
              style={{ padding: '0.25rem 0.5rem', color: 'red' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999' }}>No todos yet. Add one above!</p>
      )}
    </main>
  );
}