import { Router } from 'express';
import * as ctrl from './FinancialReport.controller';

const router = Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.byId);
router.post('/generate', ctrl.generate);
router.delete('/:id', ctrl.remove);

export default router;
