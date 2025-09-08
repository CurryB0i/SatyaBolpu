import express from 'express';
import { uploadPost } from '../controllers/PostController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.post('/',adminMiddleware,uploadPost);

export default router;
