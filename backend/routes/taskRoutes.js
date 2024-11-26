import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, searchTasks } from '../controllers/taskController.js';
import { body } from 'express-validator';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getTasks);
router.post('/', [
    auth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
], createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.get('/search', auth, searchTasks);

export default router;
