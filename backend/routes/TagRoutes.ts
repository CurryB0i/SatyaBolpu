import express from 'express';
import { addTag, getTags } from '../controllers/TagController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/',getTags);
router.post('/',adminMiddleware,addTag);

export default router;
