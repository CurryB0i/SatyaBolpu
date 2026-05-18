import express from 'express';
import { createDraft, deleteCultureDetails, deleteCultureEditorContent, getCulture, getCultures, saveCultureDetails, saveCultureEditorContent, uploadCulture } from '../controllers/CultureController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/', getCultures);
router.get('/:id', getCulture);
router.post('/', adminMiddleware, uploadCulture);
router.post('/draft', adminMiddleware, createDraft);
router.post('/draft/:id/details', adminMiddleware, saveCultureDetails);
router.post('/draft/:id/content', adminMiddleware, saveCultureEditorContent);
router.delete('/draft/:id/details', adminMiddleware, deleteCultureDetails);
router.delete('/draft/:id/content', adminMiddleware, deleteCultureEditorContent);

export default router;
