// src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './components/TodoItem';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      console.log("todos: ", todos);
      const response = await axios.get('/api/todos'); // Fetch todos from Express backend
      console.log("response: ", response);
      setTodos(response.data); // Set todos state with fetched data
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Todo List</h1>
      <div>
        {todos.length > 0 && (todos.map(todo => (
          <TodoItem key={todo._id} todo={todo} /> // Render each todo item
        )))}
      </div>
    </div>
  );
};

export default App;
