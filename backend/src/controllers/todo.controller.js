import { Todo } from '../models/todoItem.model.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import csvWriter from 'csv-writer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  console.log(`*******************************\n
  file path: `, req.file.path);
  if (!req.file) {
    return res.status(400).json({ message: 'No CSV file uploaded' });
  }

  const todoItems = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', async (row) => {
      try {
        // Assuming Todo model constructor expects an object containing todo item properties
        const todoItem = new Todo(row);
        await todoItem.save();
        todoItems.push(todoItem);
      } catch (error) {
        console.error('Error saving todo item from CSV:', error);
        return res.status(500).json({ message: 'Error saving todo item from CSV', error: error.message });
      }
    })
    .on('end', () => {
      // Delete the uploaded CSV file after processing
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting CSV file:', err);
        }
      });
      res.json({ message: 'Todo items uploaded successfully', todoItems });
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

    const filePath = new URL('../downloads/todoList.csv', import.meta.url);
    const filePathString = fileURLToPath(filePath); // Convert URL to file path

    const writer = csvWriter.createObjectCsvWriter({
      path: filePathString,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'description', title: 'Description' },
        { id: 'status', title: 'Status' }
      ]
    });

    await writer.writeRecords(todoItems.map(item => ({
      id: item._id.toString(),
      description: item.description,
      status: item.status
    })));

    res.setHeader('Content-Disposition', 'attachment; filename="todoList.csv"');
    res.download(filePathString, 'todoList.csv', (err) => { // Use file path string
      if (err) {
        console.error('Error downloading CSV file:', err);
        return res.status(500).json({ message: 'Error downloading CSV file' });
      } else {
        console.log('CSV file downloaded successfully');
        fs.unlink(filePathString, (err) => {
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