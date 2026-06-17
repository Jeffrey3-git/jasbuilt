import express from 'express';
import { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  toggleUpvote 
} from '../controllers/projects.js';
import { createComment } from '../controllers/comments.js'; // 🆕 Import the new comment helper
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Public Discover Streams
router.get('/', getAllProjects);
router.get('/:id', getProjectById); 

// Protected Action Channels
router.post('/', protect, uploadImage.single('image'), createProject);
router.post('/:id/upvote', protect, toggleUpvote); 
router.post('/:id/comments', protect, createComment); // 🆕 New comment submission route channel

export default router;
