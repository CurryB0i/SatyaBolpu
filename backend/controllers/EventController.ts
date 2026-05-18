import { Request, Response} from 'express';
import { Event } from '../models/Event.js';
import { AuthRequest, CardDataType, IEvent } from '../types/globals.js';
import { Culture } from '../models/Culture.js';
import { EventDraft } from '../models/Draft.js';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const skip = ((Number(req.query.page) || 1) - 1) * limit;

    const events: CardDataType[] =
      (await Event
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('culture')
      ).map(d => ({
        id: d._id as string,
        title: d.title,
        description: d.description,
        culture: (d.culture as any).title,
        images: d.docs
      }));
    const total = await Event.countDocuments();

    if (!events) {
      return res.status(500).json({ msg: 'No posts found.' });
    }

    return res.status(200).json({ events, total, totalPages: Math.ceil(total / limit) });
  } catch(err: any) {
    console.error("Get Events Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching events.' });
  }
}

export const getEvent = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    const event: IEvent | null = await Event.findOne({ _id: id }).populate('culture', 'title');
    if(!event) {
      return res.status(404).json({ msg: 'No event found.' });
    }

    return res.status(200).json({ event : { 
      ...event,  
      culture: (event.culture as any).title,
      duration: {
        start: event.duration.start.toISOString().split("T")[0],
        end: event.duration.end.toISOString().split("T")[0]
      }
    }});
  } catch(err: any) {
    console.error("Get Events Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching events.' });
  }
}

export const saveEventDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { details } = req.body;
    if (!id || !details) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const culture = await Culture.findById(details.culture);
    if(!culture) {
      return res.status(400).json({ msg: 'Culture not found.' });
    }

    const draft = await EventDraft.findByIdAndUpdate(
      id,
      details,
      { new: true }
    );

    const { _id, __v, ...rest } = draft!.toObject();
    return res.status(201).json({ culture: { id: _id, ...rest } });

  } catch (err: any) {
    console.error("Error while saving event details: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while saving event details.' });
  }
}

export const deleteEventDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if(!id) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    await EventDraft.findByIdAndUpdate(
      id,
      { 
        $unset: { 
          title: "",
          description: "",
          duration: "",
          culture: "",
          docs: ""
       } 
      }
    );
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error while deleting event details: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while deleting event details.' });
  }
}

export const saveEventLocation = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { location } = req.body;

    if (!location || !id) {
      return res.status(400).json({ msg: 'Missing Required Field' });
    }

    let draft;
    draft = await EventDraft.findByIdAndUpdate(
      id,
      { 
        location: {
          type: "Point",
          district: location.district,
          taluk: location.taluk,
          village: location.village,
          coordinates: [location.lat, location.lng]
        }
      },
      { new: true }
    );

    const { _id, __v, ...rest } = draft!.toObject();
    return res.status(201).json({ post: { id: _id, ...rest } });

  } catch (err: any) {
    console.error('Error while saving event location: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while saving event location.' });
  }
}

export const deleteEventLocation = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if(!id) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    await EventDraft.findByIdAndUpdate(
      id,
      { 
        $unset: { 
          location: ""
       } 
      }
    );
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error while deleting event location: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while deleting event location.' });
  }
}

export const createDraft = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const event = (await Event.findById(id))?.toObject();
    if(!event) {
      return res.status(404).json("Post not found.");
    }

    const { _id } = await EventDraft.create({ ...event });
    return res.status(201).json({ _id });

  } catch (err: any) {
    console.error('Error while creating post draft: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while creating post draft.' });
  }
}

export const uploadEvent = async (req: Request, res: Response) => {
  try {
    const { details, location } = req.body;
    if(!details || !location) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const culture = await Culture.findById(details.culture);
    if(!culture) {
      return res.status(400).json({ msg: 'Culture not found.' });
    }

    const newEvent = await Event.create({
      ...details,
      location
    });
    const { _id, __v, ...rest } = newEvent.toObject();
    return res.status(201).json({ event: { id: _id, ...rest } });

  } catch(err: any) {
    console.error("Upload Events Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while uploading event.' });
  }
}