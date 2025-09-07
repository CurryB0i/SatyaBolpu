import { Request, Response} from 'express';
import { Culture, ICulture } from '../models/Cuture.js';

export const getCultures = async (req: Request, res: Response) => {
  try {
    const cultures: ICulture[] | null = await Culture.find();
    if(!cultures) {
      return res.status(404).json({ msg: 'No cultures found.' });
    }

    return res.status(200).json({ cultures });
  } catch(err: any) {
    console.error("Get Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching cultures.' });
  }
}

export const getCulture = async (req: Request, res: Response) => {
  try {
    let { name } = req.params;
    name = name.charAt(0).toUpperCase() + name.slice(1,name.length);
    const culture: ICulture | null = await Culture.findOne({ name });
    if(!culture) {
      return res.status(404).json({ msg: 'No culture found.' });
    }

    return res.status(200).json({ culture });
  } catch(err: any) {
    console.error("Get Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching cultures.' });
  }
}

export const uploadCulture = async (req: Request, res: Response) => {
  try {
    const { details, content } = req.body;
    if(!details || !content) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const doesExist = await Culture.findOne({ name: details.name });
    if(doesExist) {
      return res.status(400).json({ msg: `Culture '${name}' already exists.` })
    }

    const newCulture = await Culture.create({
      name: details.name,
      descriptiveName: details.descriptiveName,
      description: details.description,
      coverImages: details.coverImages,
      galleryImages: details.galleryImages.
      content, 
      posts: 0 
    });
    const { _id, __v, ...rest } = newCulture.toObject();
    return res.status(201).json({ post: { id: _id, ...rest } });

  } catch(err: any) {
    console.error("Upload Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while uploading culture.' });
  }
}
