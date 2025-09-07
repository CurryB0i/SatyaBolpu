import express from 'express';
import { uploadController, uploadMultipleController } from '../controllers/UploadController.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();

router.post('/single',upload.single('file'),uploadController);
router.post('/multiple',upload.array('files'),uploadMultipleController);

export default router;
