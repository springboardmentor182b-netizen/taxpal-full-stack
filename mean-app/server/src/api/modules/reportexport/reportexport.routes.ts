import express from 'express';
import * as Controller from './reportexport.controller';

const router = express.Router();

router.post('/generate', Controller.generate);
router.get('/download/:id', Controller.download);
router.get('/list', Controller.list);
router.delete('/:id', Controller.remove);

export default router;
