import { Router } from 'express';
import * as categoryController from './category.controller.js';

const router = Router();

// Base path is /api/category (assuming it's mounted as such in app.ts)

/**
 * @route GET /api/category
 * @desc Get all categories for the authenticated user
 * @access Private (requires authMiddleware)
 */
router.get('/', categoryController.getCategories);

/**
 * @route POST /api/category
 * @desc Create a new category
 * @access Private (requires authMiddleware)
 */
router.post('/', categoryController.createCategory);

/**
 * @route PUT /api/category/:id
 * @desc Update an existing category by ID
 * @access Private (requires authMiddleware and ownership check in controller/service)
 */
router.put('/:id', categoryController.updateCategory);

/**
 * @route DELETE /api/category/:id
 * @desc Delete a category by ID
 * @access Private (requires authMiddleware and ownership check in controller/service)
 */
router.delete('/:id', categoryController.deleteCategory);

export default router;
