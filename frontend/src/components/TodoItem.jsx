// src/TodoItem.jsx
import React from 'react';

const TodoItem = ({ todo }) => {
  return (
    <div className="border rounded p-2 mb-2">
      <h3 className="text-lg font-bold">{todo.title}</h3>
      <p className="text-sm">{todo.description}</p>
    </div>
  );
};

export default TodoItem;
