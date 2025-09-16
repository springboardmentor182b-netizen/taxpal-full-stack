import { Router } from 'express';
import { getDashboard, addDashboard } from './dashboard.controller';

const router = Router();

// RESTful versioned endpoints
router.get('/:id', getDashboard);   // GET /api/v1/dashboard/:id
router.post('/', addDashboard);     // POST /api/v1/dashboard

export default router;


