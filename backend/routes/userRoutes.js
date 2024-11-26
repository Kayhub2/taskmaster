import express from 'express';
import { register, login } from '../controllers/userController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register', [
    body('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], register);

router.post('/login', [
    body('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], login);

export default router;
