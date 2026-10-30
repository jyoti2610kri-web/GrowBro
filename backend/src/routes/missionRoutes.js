import express from 'express';
import {
    getMissions,
    completeMission,
    createMission,
    undoMission
} from '../controllers/missionController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getMissions);
router.post('/complete', authMiddleware, completeMission);
router.delete('/complete/:missionId', authMiddleware, undoMission);
router.post('/', createMission); // Admin or dev only in real app

export default router;