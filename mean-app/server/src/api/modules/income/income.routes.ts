import { Router } from 'express';
import { createIncome } from './income.controller';
import { auth } from '../../middlewares/auth';  // <- named import
const router = Router();
router.post('/',auth, createIncome);
export default router;
