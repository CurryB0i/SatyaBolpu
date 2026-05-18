import { Request, Response } from 'express';
import { Culture } from '../models/Culture.js';
import { CultureDraft } from '../models/Draft.js';

export const getCultures = async (req: Request, res: Response) => {
  try {
    const fields = req.query?.fields?.toString().split(",").join(" ");
    const sortBy = req.query?.sortBy?.toString() ?? "title";
    const orderBy = req.query?.orderBy?.toString() ?? "desc";
    const cultures = await Culture.find().select(fields ?? "").sort({ [sortBy]: orderBy === "asc" ? 1 : -1 });
    if (!cultures) {
      return res.status(404).json({ msg: 'No cultures found.' });
    }

    return res.status(200).json({ cultures });
  } catch (err: any) {
    console.error("Get Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching cultures.' });
  }
}

export const getCulture = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const culture = await Culture.findById(id);
    if (!culture) {
      return res.status(404).json({ msg: 'No culture found.' });
    }

    return res.status(200).json({ culture });
  } catch (err: any) {
    console.error("Get Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching cultures.' });
  }
}

export const saveCultureDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { details } = req.body;
    if (!details) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const doesExist = await Culture.findOne({ title: details.title });
    if (doesExist) {
      return res.status(400).json({ msg: `Culture '${details.title}' already exists.` })
    }

    const draft = await CultureDraft.findByIdAndUpdate(
      id,
      {
        title: details.title,
        descriptiveName: details.descriptiveName,
        description: details.description,
        coverImages: details.coverImages,
        galleryImages: details.galleryImages
      },
      { new: true, upsert: true }
    );

    const { _id, __v, ...rest } = draft.toObject();
    return res.status(201).json({ culture: { id: _id, ...rest } });

  } catch (err: any) {
    console.error("Error while saving culture details: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while saving culture details.' });
  }
}

export const deleteCultureDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if(!id) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    await CultureDraft.findByIdAndUpdate(
      id,
      { 
        $unset: { 
          title: "",
          descriptiveName: "",
          description: "",
          coverImages: "",
          galleryImages: ""
       } 
      }
    );
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error while deleting culture details: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while deleting culture details.' });
  }
}

export const deleteCultureEditorContent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if(!id) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    await CultureDraft.findByIdAndUpdate(
      id,
      { 
        $unset: { 
          content: ""
       } 
      }
    );
    res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error while deleting culture editor content: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while deleting culture editor content.' });
  }
}

export const saveCultureEditorContent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { content } = req.body;

    if (content === undefined || content === null) {
      return res.status(400).json({ msg: 'Missing Required Field' });
    }

    const draft = await CultureDraft.findByIdAndUpdate(
      id,
      { content },
      { new: true, upsert: true }
    );

    const { _id, __v, ...rest } = draft.toObject();
    return res.status(201).json({ culture: { id: _id, ...rest } });

  } catch (err: any) {
    console.error('Error while saving culture editor content: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while saving culture editor content.' });
  }
}

export const createDraft = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const culture = (await Culture.findById(id))?.toObject();
    if(!culture) {
      return res.status(404).json("Post not found.");
    }

    const { _id } = await CultureDraft.create({ ...culture });
    return res.status(201).json({ _id });

  } catch (err: any) {
    console.error('Error while creating post draft: ', err.message);
    return res.status(500).json({ msg: 'Internal Server error while creating post draft.' });
  }
}

export const uploadCulture = async (req: Request, res: Response) => {
  try {
    const { details, content } = req.body;
    if (!details || !content) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const cultureName = details.title.charAt(0).toUpperCase() + details.title.slice(1);
    const doesExist = await Culture.findOne({ title: cultureName });
    if (doesExist) {
      return res.status(400).json({ msg: `Culture '${details.title}' already exists.` })
    }

    const newCulture = await Culture.create({
      title: details.title,
      descriptiveName: details.descriptiveName,
      description: details.description,
      coverImages: details.coverImages,
      galleryImages: details.galleryImages,
      content: content,
      posts: 0
    });
    const { _id, __v, ...rest } = newCulture.toObject();
    return res.status(201).json({ culture: { id: _id, ...rest } });

  } catch (err: any) {
    console.error("Upload Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while uploading culture.' });
  }
}
