import express from 'express';
import { register, login } from '../controllers/userController.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validateUser = [
    body('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/register', validateUser, handleValidationErrors, register);
router.post('/login', validateUser, handleValidationErrors, login);

export default router;
