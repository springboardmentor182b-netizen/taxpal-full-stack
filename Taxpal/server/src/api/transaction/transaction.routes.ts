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

r.use(authenticateToken);

r.get('/', getTransactions);
r.get('/:id', getTransactionById);
r.post('/', validateTransaction, handleValidationErrors, createTransaction);
r.put('/:id', validateTransaction, handleValidationErrors, updateTransaction);
r.delete('/', deleteAllTransactions);
r.delete('/:id', deleteTransaction);

export default r;
