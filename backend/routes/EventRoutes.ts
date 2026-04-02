import express from 'express';
import { getEvent, getEvents, uploadEvent } from '../controllers/EventController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/',getEvents);
router.get('/:id',getEvent);
router.post('/',adminMiddleware,uploadEvent);

export default router;
