import type { Response } from 'express';
import type { AuthRequest } from '../../middlewares/auth.middleware.js';
import * as taxService from './taxEstimator.service.js';

/**
 * Handles the request to estimate a user's income tax.
 */
export async function getTaxEstimate(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user?.id) {
      res.status(400).json({ message: 'User ID is missing from the authentication token' });
      return;
    }

    const taxDetails = await taxService.estimateTax(req.user.id);
    res.status(200).json(taxDetails);
  } catch (error) {
    console.error('Error calculating tax estimate:', error);
    res.status(500).json({ message: 'An error occurred while estimating the tax', error });
  }
}
