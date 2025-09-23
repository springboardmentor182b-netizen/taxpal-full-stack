// transaction.routes.ts
import { Router } from 'express';
import { authenticateToken } from '../auth/auth';
import {
  createTransaction, deleteTransaction, getTransactions, updateTransaction, validateTransaction
} from '../dashboard/transactionController';
import { handleValidationErrors } from '../../utils/validators/dashboardValidation';

const r = Router();
r.use(authenticateToken);
r.get('/', getTransactions);
r.post('/', validateTransaction, handleValidationErrors, createTransaction);
r.put('/:id', validateTransaction, handleValidationErrors, updateTransaction);
r.delete('/:id', deleteTransaction);
export default r;
