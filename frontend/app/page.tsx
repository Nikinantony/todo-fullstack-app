'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/todos';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');

  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTitle.trim()) return;
    await axios.post(API_URL, { title: newTitle });
    setNewTitle('');
    fetchTodos();
  };

  const toggleComplete = async (todo: Todo) => {
    await axios.put(`${API_URL}/${todo.id}`, {
      title: todo.title,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>My Todo List</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter a new todo"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid #ccc',
            }}
          >
            <span
              onClick={() => toggleComplete(todo)}
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: 10 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}