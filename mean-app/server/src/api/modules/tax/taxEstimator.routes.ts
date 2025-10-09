import { Router } from 'express';
import * as taxController from './taxestimator.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

// The tax estimator route requires authentication
router.use(authMiddleware);

// Defines the endpoint to get the tax estimation
// Method: GET
// Endpoint: /api/tax/estimate
router.get('/estimate', taxController.getTaxEstimate);

export default router;
