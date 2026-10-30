import express from 'express';
import { 
  createDiscussion, 
  getDiscussions, 
  getDiscussionById, 
  likeDiscussion,
  addComment 
} from '../controllers/discussionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDiscussions);
router.get('/:id', getDiscussionById);
router.post('/', authMiddleware, createDiscussion);
router.patch('/:id/like', authMiddleware, likeDiscussion);
router.post('/comments', authMiddleware, addComment);

export default router;
