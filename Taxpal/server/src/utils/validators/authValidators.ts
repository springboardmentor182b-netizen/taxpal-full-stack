import { body } from 'express-validator';

export const registerValidator = [
  body('name').isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
    .matches(/\d/).withMessage('Password must include a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must include a special character'),
  body('country').optional().isString(),
  body('income_bracket').optional().isIn(['low', 'middle', 'high']),
];

export const loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isString().isLength({ min: 6 }).withMessage('Password is required'),
];

export const forgotValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const resetValidator = [
  body('token').isString().withMessage('Reset token is required'),
  body('password')
    .isString()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password must include a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must include an uppercase letter')
    .matches(/\d/).withMessage('Password must include a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must include a special character'),
];
