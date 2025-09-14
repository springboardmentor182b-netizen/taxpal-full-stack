import { Router } from 'express';
import { getSummary } from './dashboard.controller';

const router = Router();

router.get('/summary', getSummary);

export default router;
