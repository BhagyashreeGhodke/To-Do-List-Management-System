import express from 'express';
import * as todoController from '../controllers/todo.controller.js';

const router = express.Router();

// Define routes for CRUD operations
router.get('/', todoController.getAllTodoItems);
router.get('/:id', todoController.getTodoItemById);
router.post('/', todoController.createTodoItem);
router.put('/:id', todoController.updateTodoItem);
router.delete('/:id', todoController.deleteTodoItem);

// Additional routes
// Upload todo items from a CSV file
router.post('/upload', todoController.uploadTodoItemsFromCSV);

// Download the todo list in CSV format
router.get('/download', todoController.downloadTodoListCSV);

// Filter todo list items based on status
router.get('/filter', todoController.filterTodoItemsByStatus);

export default router;
