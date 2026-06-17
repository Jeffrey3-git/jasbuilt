import express from 'express';
import { toggleUpvote } from '../controllers/upvotes.js';
import { protect } from '../middleware/auth.js'; // Using your clean naming convention!

const router = express.Router();

// The upvote action is fundamentally protective: you must be a verified student to vote
router.post('/:id/upvote', protect, toggleUpvote);

export default router;