import { Router } from 'express';
import * as ctrl from './ExportDownload.controller';

const router = Router();

router.post('/preview', ctrl.preview);
router.post('/download', ctrl.download);

export default router;
