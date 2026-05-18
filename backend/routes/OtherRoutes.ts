import express from 'express';
import { addPostGroup, addPostType, addTag, getPostGroups, getPostTypes, getTags } from '../controllers/OtherController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/tags', getTags);
router.get('/post-types', getPostTypes);
router.get('/post-groups', getPostGroups);
router.post('/post-groups', adminMiddleware, addPostGroup);
router.post('/tags', adminMiddleware, addTag);
router.post('/post-types', adminMiddleware, addPostType);

export default router;