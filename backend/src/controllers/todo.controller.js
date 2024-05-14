import { Todo } from '../models/todoItem.model.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-write-stream';

// Get all todo items
export const getAllTodoItems = async (req, res) => {
  try {
    const todoItems = await Todo.find();
    console.log("todoItems ", todoItems);
    res.json(todoItems);
    console.log("json todoItems: ", todoItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single todo item by ID
export const getTodoItemById = async (req, res) => {
  try {
    const todoItem = await Todo.findById(req.params.id);
    if (todoItem) {
      res.json(todoItem);
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new todo item
export const createTodoItem = async (req, res) => {
  const { description, status } = req.body;
  const todoItem = new Todo({
    description,
    status: status || 'pending'
  });
  try {
    const newTodoItem = await todoItem.save();
    res.status(201).json(newTodoItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing todo item
export const updateTodoItem = async (req, res) => {
  try {
    const { description, status } = req.body;
    const todoItem = await Todo.findById(req.params.id);
    if (todoItem) {
      todoItem.description = description || todoItem.description;
      todoItem.status = status || todoItem.status;
      const updatedTodoItem = await todoItem.save();
      res.json(updatedTodoItem);
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a todo item
export const deleteTodoItem = async (req, res) => {
  try {
    const todoItem = await Todo.findById(req.params.id);
    if (todoItem) {
      console.log("todoItem: ", todoItem);
      await todoItem.deleteOne();
      res.json({ message: 'Todo item deleted' });
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload todo items from a CSV file
export const uploadTodoItemsFromCSV = (req, res) => {
  // console.log("file: ", req.file);
  if (!req.file) {
    return res.status(400).json({ message: 'No CSV file uploaded' });
  }

  const todoItems = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', async (row) => {
      try {
        const todoItem = new Todo(row);
        await todoItem.save();
        todoItems.push(todoItem);
      } catch (error) {
        console.error('Error saving todo item from CSV:', error);
      }
    })
    .on('end', () => {
      res.json({ message: 'Todo items uploaded successfully' });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      res.status(500).json({ message: 'Error parsing CSV', error: error.message });
    });
};

export const downloadTodoListCSV = async (req, res) => {
  try {
    const todoItems = await Todo.find();
    if (!todoItems || todoItems.length === 0) {
      return res.status(404).json({ message: 'No todo items found' });
    }

    const filePath = "../backend/src/downloadCSVFile/todoList.csv"
    const writer = csvWriter();
    writer.pipe(fs.createWriteStream(filePath));

    writer.write({ id: 'ID', description: 'Description', status: 'Status' });

    todoItems.forEach(item => {
      writer.write({ id: item._id.toString(), description: item.description, status: item.status });
    });

    writer.end();

    res.download(filePath, 'todoList.csv', (err) => {
      if (err) {
        console.error('Error downloading CSV file:', err);
        return res.status(500).json({ message: 'Error downloading CSV file' });
      } else {
        console.log('CSV file downloaded successfully');
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting CSV file:', err);
          } else {
            console.log('CSV file deleted successfully');
          }
        });
      }
    });
  } catch (error) {
    console.error('Error downloading todo list:', error);
    res.status(500).json({ message: 'Error downloading todo list', error: error.message });
  }
};


// Filter todo items based on status
export const filterTodoItemsByStatus = async (req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({ message: 'Status parameter is required' });
  }
  try {
    const todoItems = await Todo.find({ status });
    res.json(todoItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};