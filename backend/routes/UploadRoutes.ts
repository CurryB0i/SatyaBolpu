import express from 'express';
import { uploadController, uploadMultipleController } from '../controllers/UploadController.js';
import { upload } from '../middleware/Multer.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.post('/single',adminMiddleware,upload.single('file'),uploadController);
router.post('/multiple',adminMiddleware,upload.array('files'),uploadMultipleController);

export default router;
