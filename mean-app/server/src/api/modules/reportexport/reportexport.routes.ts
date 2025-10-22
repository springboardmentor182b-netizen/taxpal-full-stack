import express from 'express';
import * as Controller from './reportexport.controller';

const router = express.Router();

/**
 * Routes:
 * POST   /api/exportreport/generate    → Create and save a new report
 * GET    /api/exportreport/download/:id → Download report file
 * GET    /api/exportreport/list?user_id=xyz → List reports by user
 * DELETE /api/exportreport/:id          → Delete a report
 */
router.post('/generate', Controller.generate);
router.get('/download/:id', Controller.download);
router.get('/list', Controller.list);
router.delete('/:id', Controller.remove);

export default router;
