import express from 'express';
import { createDraft, deletePostDetails, deletePostEditorContent, deletePostLocation, getPost, getPostGroups, getPosts, savePostDetails, savePostEditorContent, savePostLocation, uploadPost } from '../controllers/PostController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/post-groups', getPostGroups);
router.get('/:id', getPost);
router.post('/', adminMiddleware, uploadPost);
router.post('/draft/:id', adminMiddleware, createDraft);
router.post('/draft/:id/details', adminMiddleware, savePostDetails);
router.post('/draft/:id/content', adminMiddleware, savePostEditorContent);
router.post('/draft/:id/location', adminMiddleware, savePostLocation);
router.delete('/draft/:id/details', adminMiddleware, deletePostDetails);
router.delete('/draft/:id/content', adminMiddleware, deletePostEditorContent);
router.delete('/draft/:id/location', adminMiddleware, deletePostLocation);

export default router;