import express from 'express';
import { createDraft, deleteEventDetails, deleteEventLocation, getEvent, getEvents, saveEventDetails, saveEventLocation, uploadEvent } from '../controllers/EventController.js';
import { adminMiddleware } from '../middleware/AdminMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', adminMiddleware, uploadEvent);
router.post('/draft', adminMiddleware, createDraft);
router.post('/draft/:id/details', adminMiddleware, saveEventDetails);
router.post('/draft/:id/location', adminMiddleware, saveEventLocation);
router.delete('/draft/:id/details', adminMiddleware, deleteEventDetails);
router.delete('/draft/:id/location', adminMiddleware, deleteEventLocation);

export default router;
