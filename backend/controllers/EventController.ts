import { Request, Response} from 'express';
import { Event } from '../models/Event.js';
import { IEvent } from '../types/globals.js';
import { Culture } from '../models/Culture.js';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events: IEvent[] | null = await Event.find();
    if(!events) {
      return res.status(404).json({ msg: 'No events found.' });
    }

    return res.status(200).json({ events });
  } catch(err: any) {
    console.error("Get Events Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching events.' });
  }
}

export const getEvent = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    const event: IEvent | null = await Event.findOne({ _id: id });
    if(!event) {
      return res.status(404).json({ msg: 'No event found.' });
    }

    return res.status(200).json({ event });
  } catch(err: any) {
    console.error("Get Events Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching events.' });
  }
}

export const uploadEvent = async (req: Request, res: Response) => {
  try {
    const { details, location } = req.body;
    if(!details || !location) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const cultureName = details.culture.charAt(0).toUpperCase() + details.culture.slice(1);
    const culture = await Culture.findOne({ name: cultureName });
    if(!culture) {
      return res.status(400).json({ msg: 'Culture not found.' });
    }

    const newEvent = await Event.create({
      name: details.name,
      description: details.description,
      duration: details.duration,
      culture: culture._id,
      docs: details.docs,
      location
    });
    const { _id, __v, ...rest } = newEvent.toObject();
    return res.status(201).json({ event: { id: _id, ...rest } });

  } catch(err: any) {
    console.error("Upload Events Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while uploading event.' });
  }
}
