import { Router } from 'express';
import { authenticateToken } from '../auth/auth';
import {
  createTransaction,
  deleteTransaction,
  deleteAllTransactions,
  getTransactions,
  getTransactionById,
  updateTransaction,
  validateTransaction,
} from './transactionController';
import { handleValidationErrors } from '../../utils/validators/dashboardValidation';

const r = Router();

// all transaction routes require auth
r.use(authenticateToken);

// List transactions (supports filters via query)
r.get('/', getTransactions);

// Get one by id (needed by Angular getTransaction(id))
r.get('/:id', getTransactionById);

// Create
r.post('/', validateTransaction, handleValidationErrors, createTransaction);

// Update one
r.put('/:id', validateTransaction, handleValidationErrors, updateTransaction);

// Delete ALL for current user
r.delete('/', deleteAllTransactions);

// Delete one by id
r.delete('/:id', deleteTransaction);

export default r;
