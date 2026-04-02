import express from 'express';
import { getPost, getPosts, uploadPost } from '../controllers/PostController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', adminMiddleware, uploadPost);

export default router;
