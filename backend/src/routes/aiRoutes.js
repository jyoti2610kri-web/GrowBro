
import express from 'express';
import {
    askAi,
    getAiHistory,
    startMockInterview
} from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/history', getAiHistory);
router.post('/ask', askAi);
router.post('/mock-interview', startMockInterview);

export default router;
