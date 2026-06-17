import express from 'express';
import { getUserProfile } from '../controllers/users.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);

export default router;