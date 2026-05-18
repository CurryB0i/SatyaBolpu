import express from 'express';
import { createDraft, deleteDraft, getDraft, getDrafts } from "../controllers/DraftController.js";
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/', adminMiddleware, getDrafts);
router.post('/', adminMiddleware, createDraft);
router.get('/:id', adminMiddleware, getDraft);
router.delete('/:id', adminMiddleware, deleteDraft);

export default router;