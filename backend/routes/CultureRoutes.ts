import express from 'express';
import { getCulture, getCultures, uploadCulture } from '../controllers/CultureController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/',getCultures);
router.get('/:name',getCulture);
router.post('/',adminMiddleware,uploadCulture);

export default router;
