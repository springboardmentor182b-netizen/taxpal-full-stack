import { Router } from 'express';
import { requireAuth } from '../auth/requireAuth';
import { createIncome, deleteIncome, listIncomes, updateIncome } from './income.controller';

const r = Router();
r.use(requireAuth);

r.post('/', createIncome);
r.get('/', listIncomes);
r.put('/:id', updateIncome);
r.delete('/:id', deleteIncome);

export default r;
