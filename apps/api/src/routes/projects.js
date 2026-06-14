import express from 'express';
import { createProject, getAllProjects } from '../controllers/projects.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';

const router = express.Router();

// Public Feed Discovery
router.get('/', getAllProjects);

// Protected Submission Gateway with Media Stream Integration
// 'image' is the exact name of the file field the frontend will send
router.post('/', protect, uploadImage.single('image'), createProject);

export default router;